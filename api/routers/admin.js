const express = require("express");
const Vehicle = require("../../backend/src/models/Vehicle");
const Station = require("../../backend/src/models/Station");
const Pass = require("../../backend/src/models/Pass");
const csv = require("csvtojson");
const moment = require("moment");


const {
  checkMongoConnection,
} = require("../../backend/src/database/connectivity");

const router = new express.Router();

router.get("/admin/healthcheck", (req, res) => {
  // ready states being:
  // 0: disconnected
  // 1: connected
  if (checkMongoConnection() == 0) {
    res.status(500).send({ status: "failed", dbconnection: "disconnected" });
  }

  if (checkMongoConnection() == 1) {
    res.status(200).send({ status: "OK", dbconnection: "connected" });
  }
});

router.post("/admin/resetpasses", async (req, res) => {
  try {
    const csvFilePath = "passes.csv";
    const jsonArray = await csv({
      colParser: {
        timestamp: function (item) {
          console.log(moment(item, "DD-MM-YYYY HH:mm"))
          return moment(item, "DD-MM-YYYY HH:mm")
        },
        charge: function (item) {
          return parseFloat(item);
        },
      },
    }).fromFile(csvFilePath);
    await Pass.insertMany(jsonArray);
    res.status(200).send({ status: "OK" });
  } catch (e) {
    console.log("error is", e);
    res.status(500).send({ status: "failed" });
  }
});

router.post("/admin/resetstations", async (req, res) => {
  try {
    const csvFilePath = "stations.csv";
    const jsonArray = await csv().fromFile(csvFilePath);
    await Station.insertMany(jsonArray);

    res.status(200).send({ status: "OK" });
  } catch (e) {
    res.status(500).send({ status: "failed" });
  }
});

router.post("/admin/resetvehicles", async (req, res) => {
  try {
    const csvFilePath = "vehicles.csv";
    const jsonArray = await csv().fromFile(csvFilePath);
    await Vehicle.insertMany(jsonArray);

    res.status(200).send({ status: "OK" });
  } catch (e) {
    res.status(500).send({ status: "failed" });
  }
});

module.exports = router;
