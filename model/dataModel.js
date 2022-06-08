const mongoose = require("mongoose");
let database_link;
const bcrypt = require("bcrypt");

if (process.env.link) {
  database_link = process.env.link;
} else {
  // local
  database_link = require("../secrets").link;
}

const validator = require("email-validator");
let dbLink = database_link;
mongoose
  .connect(dbLink)
  .then(function (connection) {
    console.log("db has been conncetd");
  })
  .catch(function (error) {
    console.log("err", error);
  });
const dataSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
  },
});
let dataModel = mongoose.model("PABUserModel", dataSchema);
module.exports = dataModel;
