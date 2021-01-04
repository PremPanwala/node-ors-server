const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    pid: { type: String },
    cid: {
      type: String,
    },
    itemname: { type: String },
    image: { type: String },
    fine: { type: String },
    oid: {
      type: String,
    },
    name: {
      type: String,
    },
    phoneno: {
      type: String,
    },
    email: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    total: {
      type: String,
    },
    is_active: {
      type: String,
    },
  },
  {
    collection: "book",
  }
);

module.exports = mongoose.model("book", userSchema);
