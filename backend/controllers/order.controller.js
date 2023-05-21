const OrderModel = require("../models/order.model");

//controller pour afficher les infos de la bdd
module.exports.getOrders = async (req, res) => {
  const orders = await OrderModel.find();
  res.status(200).json(orders);
};

//controller pour sélectionner un order selon son id
module.exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const order = await OrderModel.findOneById(id);
  if (!order) {
    return res.status(404).json({ message: "cette commande n'existe pas" });
  }
  return res.status(200).json(order);
};

//controller pour construire un order
//destructuration du code
module.exports.setOrders = async (req, res) => {
  const { reference, date, userId } = req.body;

  try {
    const order = await OrderModel.create({
      reference,
      date,
      userId,
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création de la commande.",
      error,
    });
  }
};
