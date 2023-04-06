const mongoose = require("mongoose");

const gallerieSchema = mongoose.Schema({
  imageGallerie: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("gallerie", gallerieSchema);
