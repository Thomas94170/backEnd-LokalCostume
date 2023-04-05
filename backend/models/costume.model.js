const mongoose = require("mongoose");

const costumeSchema = mongoose.Schema({
  titre: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  imageUne: {
    type: String,
    require: true,
  },
  imageDeux: {
    type: String,
    require: true,
  },
  prix: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("costume", costumeSchema);
