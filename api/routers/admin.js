const express = require("express");
const Vehicle = require("../../backend/src/models/Vehicle");
const Station = require("../../backend/src/models/Station");
const Pass = require("../../backend/src/models/Pass");
const csv = require("csvtojson");
const moment = require("moment");

const {
  checkMongoConnection
} = require("../../backend/src/database/connectivity");

const router = new express.Router();

router.get("/admin/healthcheck",  async (req, res) => {
  // ready states being:
  // 0: disconnected
  // 1: connected  
  const result = checkMongoConnection();
  if (result == 0) {
    res.status(500).send({ status: "failed", dbconnection: "disconnected" });
  }
  if (result == 1) {
    res.status(200).send({ status: "OK", dbconnection: "connected" });
  }
});

// Resets the Pass collection with the given passes data
router.post("/admin/resetpasses", async (req, res) => {
  try {

    // Create array of all the passes that will be in the collection from csv file.
    const csvFilePath = "passes.csv";
    const jsonArray = await csv({
      colParser: {
        timestamp: function (item) {
          return moment(item, "DD-MM-YYYY HH:mm")
        },
        charge: function (item) {
          return parseFloat(item);
        },
      },
    }).fromFile(csvFilePath);

    // Empty collection
    await Pass.deleteMany({});

    // Insert new passes from array
    await Pass.insertMany(jsonArray);
    res.status(200).send({ status: "OK" });
  } catch (e) {
    console.log("error is", e);
    res.status(500).send({ status: "failed" });
  }
});

// Resets the Station collection with the given stations data
router.post("/admin/resetstations", async (req, res) => {
  try {
    const csvFilePath = "stations.csv";
    // Create stations array from csv file
    const jsonArray = await csv().fromFile(csvFilePath);

    // Empty collection
    await Station.deleteMany({});

    // Insert new stations from array
    await Station.insertMany(jsonArray);

    res.status(200).send({ status: "OK" });
  } catch (e) {
    res.status(500).send({ status: "failed" });
  }
});

// Resets the Vehicle collection with the given vehicles data
router.post("/admin/resetvehicles", async (req, res) => {
  try {
    // Create vehicles array from csv file
    const csvFilePath = "vehicles.csv";
    const jsonArray = await csv().fromFile(csvFilePath);

    // Empty collection
    await Vehicle.deleteMany({});
    
    // Insert new vehicles from array
    await Vehicle.insertMany(jsonArray);

    res.status(200).send({ status: "OK" });
  } catch (e) {
    res.status(500).send({ status: "failed" });
  }
});

module.exports = router;
