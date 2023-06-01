const mongoose = require("mongoose");
const OrderModel = require("../models/order.model");

//controller pour afficher les infos de la bdd
module.exports.getOrders = async (req, res) => {
  const orders = await OrderModel.find();
  console.log("order affiché " + orders);
  res.status(200).json(orders);
};

//controller pour sélectionner un order selon son userId
module.exports.getOrderById = async (req, res) => {
  console.log("fonction appelée");
  // eslint-disable-next-line no-undef
  const userId = req.params.userId;
  // const userId = new mongoose.Types.ObjectId(req.params.userId);
  console.log("Recherche de la commande pour userId:", userId);
  const order = await OrderModel.findOne({ userId: userId });
  //const order = await OrderModel.findOne({ userId: { $eq: userId } });
  console.log("Recherche de la commande pour order:", order);
  if (!order) {
    return res.status(404).json({ message: "cette commande n'existe pas" });
  }
  return res.status(200).json(order);
};

//controller pour construire un order
//destructuration du code
module.exports.setOrders = async (req, res) => {
  const { reference, date, userId, prix } = req.body;

  try {
    const order = await OrderModel.create({
      reference,
      date,
      userId,
      prix,
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création de la commande.",
      error,
    });
  }
};
