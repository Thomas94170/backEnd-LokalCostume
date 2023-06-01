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
  prix: {
    type: String,
    require: true,
  },
  descriptif: {
    type: String,
    require: true,
  },
});

//def de la méthode de recherche dans la méthode schéma
orderSchema.statics.findOneByUserId = function (userId) {
  console.log("Searching for order with userId:", userId);
  return this.findOne({ userId: userId }).then((order) => {
    console.log("Found order:", order);
    return order;
  });
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
