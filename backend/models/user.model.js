const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  prenom: {
    type: String,
    require: true,
  },
  nom: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  mdp: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("user", userSchema);
