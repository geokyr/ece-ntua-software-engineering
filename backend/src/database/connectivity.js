const mongoose = require("mongoose");

function checkMongoConnection() {
  if (mongoose.connection.readyState == 0) {
    return 0;
  }
  if (mongoose.connection.readyState == 1) {
    return 1;
  }
}

module.exports = { checkMongoConnection };
