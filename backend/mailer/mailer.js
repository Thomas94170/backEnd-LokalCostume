const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "votre_adresse_email@gmail.com",
    pass: "votre_mot_de_passe",
  },
});

const sendConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    const mailOptions = {
      from: "votre_adresse_email@gmail.com",
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

// ...
// Lorsque la commande est confirmée
sendConfirmationEmail(userEmail, orderDetails);
// ...
