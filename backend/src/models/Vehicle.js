const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehicleID: {
      type: String
    },
    tagID: {
      type: String
    },
    tagProvider: {
      type: String
    },
    providerAbbr: {
      type: String
    },
    licenseYear: {
      type: Number
    }
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
