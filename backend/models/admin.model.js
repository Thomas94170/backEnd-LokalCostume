const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  identifiant: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("admin", adminSchema);
