const mongoose = require("mongoose");

const premSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true,
  },
  password: {
    type: String,
    //required: true,
  },
});
module.exports = mongoose.model("prems", premSchema);
