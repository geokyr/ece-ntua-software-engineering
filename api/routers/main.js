const express = require("express");
const Vehicle = require("../../backend/src/models/Vehicle");
const Station = require("../../backend/src/models/Station");
const Pass = require("../../backend/src/models/Pass");
const moment = require('moment');
const { parse } = require('json2csv');

const router = new express.Router();

const isObjEmpty = (obj) => {
  return (
    obj &&
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
};

//given format type, it formats the response object to either json or csv
const finalObjectFormat = (finalObject,formatType) => {
   if(formatType == "csv"){
      let csvHeaders = (Object.keys(finalObject));
      const opts = { csvHeaders };

      try {
        return  parse(finalObject, opts);    
      } 
      catch (err) {
        console.error(err);
      }
   }
   else {
     return finalObject   
   }
}


//Επιστρέφεται λίστα με την ανάλυση των διελεύσεων (Passes) για τον σταθμό διοδίων και για την περίοδο που δίνονται στο URL
router.get("/PassesPerStation",async (req, res) => {
  try {
    let finalObject = {};
    let passesList = [];

    //get passes from database based on the parameteres
    const passes = await Pass.find({
      stationRef: req.query.stationID,
      $and: [
        { timestamp: { $gte: moment(req.query.date_from) } },
        { timestamp: { $lte: moment(req.query.date_to) } },
      ],
    });

    //get station details from database based on stationId
    const stationDetails = await Station.findOne({
      stationID: req.query.stationID,
    });
    finalObject.stationProvider = stationDetails.stationProvider;
    finalObject.stationId = req.query.stationID;
    finalObject.RequestTimestamp = moment(Date.now()).format("YYYY-MM-DD HH:MM:SS");
    finalObject.PeriodFrom =  moment(req.query.date_from).format("YYYY-MM-DD 00:00:00");
    finalObject.PeriodTo = moment(req.query.date_to).format("YYYY-MM-DD 23:59:59");
    finalObject.NumberOfPasses = passes.length;

    if (passes.length > 0) {
      await Promise.all(
        passes.map(async (pass, index) => {
          let listObject = {};
          listObject.PassIndex = index + 1;
          listObject.PassID = pass.passID;
          listObject.PassTimeStamp = moment(pass.timestamp).format("YYYY-MM-DD HH:mm:00");
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
      
      finalObject.PassesList = passesList;
    }


    if (isObjEmpty(finalObject)) throw new Error("402");
    else res.status(200).send(finalObjectFormat(finalObject,req.query.format));
  } catch (err) {
    if (err == "Error: 402") res.sendStatus(402);
    else res.sendStatus(400);
  }
});

//Επιστρέφεται λίστα με την ανάλυση ανά σημείο των γεγονότων διέλευσης που πραγματοποιήθηκαν με tag του op2_ID σε σταθμούς του op1_ID
router.get("/PassesAnalysis", async (req, res) => {
  try {
    //get all stationIds from stationProvider
    const stationIds = await Station.find(
      { stationProvider: req.query.op1_ID },
      ["stationID", "-_id"]
    );
    //convert array of objects to array
    let arrayOfStationIds = [];
    stationIds.map((stationId) => {
      arrayOfStationIds.push(stationId.stationID);
    });
    //get all vehicleIds from the op2_ID
    const vehicleIds = await Vehicle.find({ tagProvider: req.query.op2_ID }, [
      "vehicleID",
      "-_id",
    ]);
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
        { timestamp: { $gte: moment(req.query.date_from) } },
        { timestamp: { $lte: moment(req.query.date_to) } },
      ],
    });

    let finalObject = {};
    let passesList = [];

    finalObject.op1_ID = req.query.op1_ID;
    finalObject.op2_ID = req.query.op2_ID;
    finalObject.RequestTimestamp = moment(Date.now()).format("YYYY-MM-DD HH:MM:SS");
    finalObject.PeriodFrom =  moment(req.query.date_from).format("YYYY-MM-DD 00:00:00");
    finalObject.PeriodTo = moment(req.query.date_to).format("YYYY-MM-DD 23:59:59");
    finalObject.NumberOfPasses = finalPasses.length;

    if (finalPasses.length > 0) {
      finalPasses.map((pass, index) => {
        let listObject = {};
        listObject.PassIndex = index + 1;
        listObject.PassID = pass.passID;
        listObject.StationID = pass.stationRef;
        listObject.TimeStamp = moment(pass.timestamp).format("YYYY-MM-DD HH:mm:00");
        listObject.VehicleID = pass.vehicleRef;
        listObject.Charge = pass.charge;
        passesList.push(listObject);
      });
      finalObject.PassesList = passesList;
    }

    if (isObjEmpty(finalObject)) throw new Error("402");
    else res.status(200).send(finalObjectFormat(finalObject,req.query.format));
  } catch (err) {
    if (err == "Error: 402") res.sendStatus(402);
    else res.sendStatus(400);
  }
});

//Επιστρέφεται ο αριθμός των γεγονότων διέλευσης που πραγματοποιήθηκαν με tag του op2_ID σε σταθμούς του op1_ID, καθώς και το κόστος τους, δηλαδή το ποσό που ο op2_ID οφείλει στον op1_ID, για τη δοσμένη περίοδο.
router.get("/PassesCost", async (req, res) => {
  try {
    //get all stationIds from stationProvider
    const stationIds = await Station.find(
      { stationProvider: req.query.op1_ID },
      ["stationID", "-_id"]
    );
    //convert array of objects to array
    let arrayOfStationIds = [];
    stationIds.map((stationId) => {
      arrayOfStationIds.push(stationId.stationID);
    });
    //get all vehicleIds from the op2_ID
    const vehicleIds = await Vehicle.find({ tagProvider: req.query.op2_ID }, [
      "vehicleID",
      "-_id",
    ]);
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
        { timestamp: { $gte: moment(req.query.date_from) } },
        { timestamp: { $lte: moment(req.query.date_to) } },
      ],
    });

    let finalObject = {};
    let passesCost = 0;

    finalObject.op1_ID = req.query.op1_ID;
    finalObject.op2_ID = req.query.op2_ID;
    finalObject.RequestTimestamp = moment(Date.now()).format("YYYY-MM-DD HH:MM:SS");
    finalObject.PeriodFrom = moment(req.query.date_from).format("YYYY-MM-DD 00:00:00");
    finalObject.PeriodTo = moment(req.query.date_to).format("YYYY-MM-DD 23:59:59");
    finalObject.NumberOfPasses = finalPasses.length;

    if (finalPasses.length > 0) {
      finalPasses.map((pass) => {
        passesCost += pass.charge;
      });
    }
    passesCost = Math.round(passesCost * 10) / 10;
    finalObject.PassesCost = passesCost;

    if (isObjEmpty(finalObject)) throw new Error("402");
    else res.status(200).send(finalObjectFormat(finalObject,req.query.format));
  } catch (err) {
    if (err == "Error: 402") res.sendStatus(402);
    else res.sendStatus(400);
  }
});

//Επιστρέφεται ο αριθμός των γεγονότων διέλευσης που πραγματοποιήθηκαν σε σταθμούς του op_ID, από οχήματα όλων των άλλων operators, καθώς και το κόστος τους, δηλαδή το ποσό που καθένας από τους λοιπούς operators οφείλει στον Operator op_ID, για τη δοσμένη περίοδο.
router.get("/ChargesBy", async (req, res) => {
  try {
    const stationIds = await Station.find(
      { stationProvider: req.query.op_ID },
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
        { timestamp: { $gte: moment(req.query.date_from) } },
        { timestamp: { $lte: moment(req.query.date_to) } },
      ],
    });
    let PPOList = [];
    let finalObject = {};
    finalObject.op_ID = req.query.op_ID;
    finalObject.RequestTimestamp = moment(Date.now()).format("YYYY-MM-DD HH:MM:SS");
    finalObject.PeriodFrom = moment(req.query.date_from).format("YYYY-MM-DD 00:00:00");
    finalObject.PeriodTo = moment(req.query.date_to).format("YYYY-MM-DD 23:59:59");

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
    }

    PPOList.forEach(function (item, index) {
      this[index].PassesCost = Math.round(item.PassesCost * 10) / 10;
    }, PPOList);

    finalObject.PPOList = PPOList;
    if (isObjEmpty(finalObject)) throw new Error("402");
    else res.status(200).send(finalObjectFormat(finalObject,req.query.format));
  } catch (err) {
    if (err == "Error: 402") res.sendStatus(402);
    else res.sendStatus(400);
  }
});

module.exports = router;
