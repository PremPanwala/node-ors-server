const mongoose = require("mongoose");

const panSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    //required: true,
  },
  phoneno: {
    type: String,
  },
});

module.exports = mongoose.model("rls", panSchema);
