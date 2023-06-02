const nodemailer = require("nodemailer");
require("dotenv").config();
const express = require("express");
const app = express();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    const mailOptions = {
      from: "thomas.devweb94@gmail.com",
      to: userEmail,
      subject: "Confirmation de commande",
      text: `Merci d'avoir passé votre commande. Voici les détails de votre commande : ${orderDetails}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé:", info.response);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail:", error);
  }
};

app.use(express.json());

app.post("/api/sendConfirmationEmail", (req, res) => {
  const { userEmail, orderDetails } = req.body;

  // Appeler la fonction sendConfirmationEmail pour envoyer l'e-mail
  sendConfirmationEmail(userEmail, orderDetails)
    .then(() => {
      console.log("E-mail envoyé");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi de l'e-mail:", error);
      res.sendStatus(500);
    });
});

module.exports = router;
