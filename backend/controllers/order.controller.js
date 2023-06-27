const mongoose = require("mongoose");
const OrderModel = require("../models/order.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "thirionthomas68100@gmail.com",
    pass: "pnkdmvdnpnsxuctg",
  },
});

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
  const userId = mongoose.Types.ObjectId(req.params.userId);
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

    // Récupérer le jeton d'authentification depuis les en-têtes de la requête
    const token = req.headers.authorization.split(" ")[1];

    // Décoder le jeton pour obtenir les informations de l'utilisateur, y compris l'adresse e-mail
    const decodedToken = jwt.verify(token, "votre_secret_jwt");
    const userEmail = decodedToken.email;
    console.log(userEmail);

    //contenu du mail
    const mailOptions = {
      from: "thomas.devweb94@gmail.com",
      to: userEmail,
      subject: "Merci pour votre commande, voici le récapitulatif",
      text:
        "Informations pour cotre commande : votre commande N° : " +
        reference +
        ", en date du : " +
        date +
        ", pour un prix de : " +
        prix +
        " €.",
    };
    console.log(mailOptions);

    //envoi du mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        console.log("erreur ici");
      } else {
        console.log("email envoyé avc succès:", info.response);
      }
    });

    res.status(200).json(order);
    console.log(order + "order sauvegardé");
  } catch (error) {
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création de la commande.",
      error,
    });
  }
};
