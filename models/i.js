const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    oid: { type: String },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneno: {
      type: String,
    },
    itemname: {
      type: String,
    },
    itemdetail: {
      type: String,
    },
    rent: {
      type: String,
    },
    fine: {
      type: String,
    },
    startdate: {
      type: String,
    },
    enddate: {
      type: String,
    },
    bname: {
      type: String,
    },
    bemail: {
      type: String,
    },
    bphoneno: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  {
    collection: "i",
  }
);

module.exports = mongoose.model("i", userSchema);
