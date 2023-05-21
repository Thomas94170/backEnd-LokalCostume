const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // Autres champs de la commande
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Nom du modèle référencé (User dans cet exemple)
    required: true,
  },
  reference: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
});

//def de la méthode de recherche dans la méthode schéma
orderSchema.statics.findOneById = function (id) {
  return this.findOne({ _id: id });
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
