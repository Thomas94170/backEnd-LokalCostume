const Mailchimp = require("mailchimp-api-v3");
const express = require("express");
require("dotenv").config();

const router = express.Router();

const mailchimp = new Mailchimp("a02edeb3b301796ab4e8d637f3f39808-us21");

// Route pour récupérer les abonnés
router.get("/api/subscribers", async (req, res) => {
  try {
    // Récupérez la liste des abonnés depuis MailChimp
    const response = await mailchimp.get(
      `/lists/${process.env.MAILCHIMP_LIST_ID}/members`
    );

    console.log("Abonnés récupérés avec succès :", response);

    // Répondez avec les abonnés récupérés
    res.json({ success: true, subscribers: response.members });
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnés :", error);
    // Répondez avec une erreur appropriée
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des abonnés " + error,
    });
  }
});

// Route pour enregistrer un abonné
router.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    // Ajoutez l'abonné à votre liste MailChimp
    const response = await mailchimp.post(
      `/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
      {
        email_address: email,
        status: "subscribed",
      }
    );

    console.log("Abonné ajouté avec succès :", response);

    // Répondez avec une réponse JSON appropriée
    res.json({ success: true, message: "Abonné ajouté avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'abonné :", error);
    // Répondez avec une erreur appropriée
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de l'abonné" + error,
    });
  }
});

// Exportez le routeur
module.exports = router;
