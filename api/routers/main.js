const express = require("express");
const Vehicle = require("../../backend/src/models/Vehicle");
const Station = require("../../backend/src/models/Station");
const Pass = require("../../backend/src/models/Pass");
const moment = require("moment");
const { parse } = require("json2csv");

const router = new express.Router();

//given format type, it formats the response object to either json or csv
const finalObjectFormat = (finalObject, formatType) => {
  if (formatType == "csv") {
    let csvHeaders = Object.keys(finalObject);
    const opts = { csvHeaders };

    try {
      return parse(finalObject, opts);
    } catch (err) {
      console.error(err);
    }
  } else {
    return finalObject;
  }
};

// Returns a list with passes that happened at a given station during a certain time period
router.get(
  "/PassesPerStation/:stationID/:date_from/:date_to",
  async (req, res) => {
    try {
      //check if query params are invalid
      if (moment(req.params.date_from).isAfter(req.params.date_to))
        throw new Error("400");
      else {
        if (
          req.query.format &&
          req.query.format != "csv" &&
          req.query.format != "json"
        )
          throw new Error("400");
      }

      const stationIdExists = await Station.findOne({
        stationID: req.params.stationID,
      });
      if (!stationIdExists) throw new Error("400");
      /////////////////////////

      //query params exists so we get into main body of endpoint
      let finalObject = {};
      let passesList = [];

      //get passes from database based on the parameteres
      const passes = await Pass.find({
        stationRef: req.params.stationID,
        $and: [
          { timestamp: { $gte: moment(req.params.date_from) } },
          { timestamp: { $lte: moment(req.params.date_to) } },
        ],
      });

      //get station details from database based on stationId
      const stationDetails = await Station.findOne({
        stationID: req.params.stationID,
      });

      finalObject.Station = req.params.stationID;
      finalObject.StationOperator = stationDetails.stationProvider;
      finalObject.RequestTimestamp = moment(Date.now()).format(
        "YYYY-MM-DD HH:MM:SS"
      );
      finalObject.PeriodFrom = moment(req.params.date_from).format(
        "YYYY-MM-DD 00:00:00"
      );
      finalObject.PeriodTo = moment(req.params.date_to).format(
        "YYYY-MM-DD 23:59:59"
      );
      finalObject.NumberOfPasses = passes.length;

      if (passes.length > 0) {
        await Promise.all(
          passes.map(async (pass, index) => {
            let listObject = {};
            listObject.PassIndex = index + 1;
            listObject.PassID = pass.passID;
            listObject.PassTimeStamp = moment(pass.timestamp).format(
              "YYYY-MM-DD HH:mm:00"
            );
            listObject.VehicleID = pass.vehicleRef;
            const vehicle = await Vehicle.findOne({
              vehicleID: pass.vehicleRef,
            });
            listObject.TagProvider = vehicle.tagProvider;
            if (pass.home == "true") listObject.PassType = "home";
            else listObject.PassType = "visitor";
            listObject.PassCharge = pass.charge;
            passesList.push(listObject);
          })
        );
        passesList.sort(function (a, b) {
          return new Date(a.PassTimeStamp) - new Date(b.PassTimeStamp);
        });
        finalObject.PassesList = passesList;
        res.status(200).send(finalObjectFormat(finalObject, req.query.format));
      } else res.sendStatus(402);
    } catch (err) {
      if (err == "Error: 400") res.sendStatus(400);
      else res.sendStatus(500);
    }
  }
);

// Returns list of passes that happened with a tags of operator op2_ID on stations of operator op1_ID
router.get(
  "/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to",
  async (req, res) => {
    try {
      //check if query params are invalid
      if (moment(req.params.date_from).isAfter(req.params.date_to))
        throw new Error("400");
      else {
        if (
          req.query.format &&
          req.query.format != "csv" &&
          req.query.format != "json"
        )
          throw new Error("400");
      }

      const op1_IDExists = await Station.findOne({
        stationProvider: req.params.op1_ID,
      });
      const op2_IDExists = await Station.findOne({
        stationProvider: req.params.op2_ID,
      });
      if (!op1_IDExists || !op2_IDExists) throw new Error("400");
      /////////////////////////

      //get all stationIds from stationProvider
      const stationIds = await Station.find(
        { stationProvider: req.params.op1_ID },
        ["stationID", "-_id"]
      );
      //convert array of objects to array
      let arrayOfStationIds = [];
      stationIds.map((stationId) => {
        arrayOfStationIds.push(stationId.stationID);
      });
      //get all vehicleIds from the op2_ID
      const vehicleIds = await Vehicle.find(
        { tagProvider: req.params.op2_ID },
        ["vehicleID", "-_id"]
      );
      //convert array of objects to array
      let arrayOfVehicleIds = [];
      vehicleIds.map((vehicleId) => {
        arrayOfVehicleIds.push(vehicleId.vehicleID);
      });

      //get all passes in given dates
      const finalPasses = await Pass.find({
        stationRef: { $in: arrayOfStationIds },
        vehicleRef: { $in: arrayOfVehicleIds },
        $and: [
          { timestamp: { $gte: moment(req.params.date_from) } },
          { timestamp: { $lte: moment(req.params.date_to) } },
        ],
      });

      let finalObject = {};
      let passesList = [];

      finalObject.op1_ID = req.params.op1_ID;
      finalObject.op2_ID = req.params.op2_ID;
      finalObject.RequestTimestamp = moment(Date.now()).format(
        "YYYY-MM-DD HH:MM:SS"
      );
      finalObject.PeriodFrom = moment(req.params.date_from).format(
        "YYYY-MM-DD 00:00:00"
      );
      finalObject.PeriodTo = moment(req.params.date_to).format(
        "YYYY-MM-DD 23:59:59"
      );
      finalObject.NumberOfPasses = finalPasses.length;

      if (finalPasses.length > 0) {
        finalPasses.map((pass, index) => {
          let listObject = {};
          listObject.PassIndex = index + 1;
          listObject.PassID = pass.passID;
          listObject.StationID = pass.stationRef;
          listObject.TimeStamp = moment(pass.timestamp).format(
            "YYYY-MM-DD HH:mm:00"
          );
          listObject.VehicleID = pass.vehicleRef;
          listObject.Charge = pass.charge;
          passesList.push(listObject);
        });
        passesList.sort(function (a, b) {
          return new Date(a.PassTimeStamp) - new Date(b.PassTimeStamp);
        });

        finalObject.PassesList = passesList;
        res.status(200).send(finalObjectFormat(finalObject, req.query.format));
      } else res.sendStatus(402);
    } catch (err) {
      if (err == "Error: 400") res.sendStatus(400);
      else res.sendStatus(500);
    }
  }
);

// Returns the count and total cost of passes that occured at stations of op1_ID with tags of op2_ID
router.get(
  "/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to",
  async (req, res) => {
    try {
      //check if query params are invalid
      if (moment(req.params.date_from).isAfter(req.params.date_to))
        throw new Error("400");
      else {
        if (
          req.query.format &&
          req.query.format != "csv" &&
          req.query.format != "json"
        )
          throw new Error("400");
      }

      const op1_IDExists = await Station.findOne({
        stationProvider: req.params.op1_ID,
      });
      const op2_IDExists = await Station.findOne({
        stationProvider: req.params.op2_ID,
      });
      if (!op1_IDExists || !op2_IDExists) throw new Error("400");
      /////////////////////////

      //get all stationIds from stationProvider
      const stationIds = await Station.find(
        { stationProvider: req.params.op1_ID },
        ["stationID", "-_id"]
      );
      //convert array of objects to array
      let arrayOfStationIds = [];
      stationIds.map((stationId) => {
        arrayOfStationIds.push(stationId.stationID);
      });
      //get all vehicleIds from the op2_ID
      const vehicleIds = await Vehicle.find(
        { tagProvider: req.params.op2_ID },
        ["vehicleID", "-_id"]
      );
      //convert array of objects to array
      let arrayOfVehicleIds = [];
      vehicleIds.map((vehicleId) => {
        arrayOfVehicleIds.push(vehicleId.vehicleID);
      });

      //get all passes in given dates
      const finalPasses = await Pass.find({
        stationRef: { $in: arrayOfStationIds },
        vehicleRef: { $in: arrayOfVehicleIds },
        $and: [
          { timestamp: { $gte: moment(req.params.date_from) } },
          { timestamp: { $lte: moment(req.params.date_to) } },
        ],
      });

      let finalObject = {};
      let passesCost = 0;

      finalObject.op1_ID = req.params.op1_ID;
      finalObject.op2_ID = req.params.op2_ID;
      finalObject.RequestTimestamp = moment(Date.now()).format(
        "YYYY-MM-DD HH:MM:SS"
      );
      finalObject.PeriodFrom = moment(req.params.date_from).format(
        "YYYY-MM-DD 00:00:00"
      );
      finalObject.PeriodTo = moment(req.params.date_to).format(
        "YYYY-MM-DD 23:59:59"
      );
      finalObject.NumberOfPasses = finalPasses.length;

      if (finalPasses.length > 0) {
        finalPasses.map((pass) => {
          passesCost += pass.charge;
        });
      }
      passesCost = Math.round(passesCost * 10) / 10;
      finalObject.PassesCost = passesCost;

      res.status(200).send(finalObjectFormat(finalObject, req.query.format));
    } catch (err) {
      if (err == "Error: 400") res.sendStatus(400);
      else res.sendStatus(500);
    }
  }
);

// Returns the number of passes that happened at stations of op1_ID with tags of every other operator
// and how much each operator owes op1_ID
router.get("/ChargesBy/:op_ID/:date_from/:date_to", async (req, res) => {
  try {
    //check if query params are invalid
    if (moment(req.params.date_from).isAfter(req.params.date_to))
      throw new Error("400");
    else {
      if (
        req.query.format &&
        req.query.format != "csv" &&
        req.query.format != "json"
      )
        throw new Error("400");
    }

    const op_IDExists = await Station.findOne({
      stationProvider: req.params.op_ID,
    });
    if (!op_IDExists) throw new Error("400");
    /////////////////////////

    //query params exists so we get into main body of endpoint
    const stationIds = await Station.find(
      { stationProvider: req.params.op_ID },
      ["stationID", "-_id"]
    );
    //convert array of objects to array
    let arrayOfStationIds = [];
    stationIds.map((stationId) => {
      arrayOfStationIds.push(stationId.stationID);
    });
    //get all op_ID passes in given dates
    const op_IDPasses = await Pass.find({
      stationRef: { $in: arrayOfStationIds },
      home: { $eq: "false" },
      $and: [
        { timestamp: { $gte: moment(req.params.date_from) } },
        { timestamp: { $lte: moment(req.params.date_to) } },
      ],
    });
    let PPOList = [];
    let finalObject = {};
    finalObject.op_ID = req.params.op_ID;
    finalObject.RequestTimestamp = moment(Date.now()).format(
      "YYYY-MM-DD HH:MM:SS"
    );
    finalObject.PeriodFrom = moment(req.params.date_from).format(
      "YYYY-MM-DD 00:00:00"
    );
    finalObject.PeriodTo = moment(req.params.date_to).format(
      "YYYY-MM-DD 23:59:59"
    );

    if (op_IDPasses.length > 0) {
      await Promise.all(
        op_IDPasses.map(async (pass, index) => {
          let listObject = {};
          const vehicle = await Vehicle.findOne(
            {
              vehicleID: pass.vehicleRef,
            },
            ["tagProvider", "-_id"]
          );
          let ppoItemIndex = PPOList.findIndex(
            (item) => item.VisitingOperator === vehicle.tagProvider
          );
          if (ppoItemIndex != -1) {
            PPOList[ppoItemIndex].NumberOfPasses += 1;
            PPOList[ppoItemIndex].PassesCost += pass.charge;
          } else {
            listObject.VisitingOperator = vehicle.tagProvider;
            listObject.NumberOfPasses = 1;
            listObject.PassesCost = pass.charge;
            PPOList.push(listObject);
          }
        })
      );
      PPOList.forEach(function (item, index) {
        this[index].PassesCost = Math.round(item.PassesCost * 10) / 10;
      }, PPOList);
      finalObject.PPOList = PPOList;
      res.status(200).send(finalObjectFormat(finalObject, req.query.format));
    } else res.sendStatus(402);
  } catch (err) {
    if (err == "Error: 400") res.sendStatus(400);
    else res.sendStatus(500);
  }
});

module.exports = router;
