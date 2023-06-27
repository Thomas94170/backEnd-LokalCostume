const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/admin.model");

//afficher l'admin

module.exports.getAdmins = async (req, res) => {
  const admins = await AdminModel.find();

  res.status(200).json(admins);
};

// création de l'admin

module.exports.setAdmins = async (req, res) => {
  console.log("setAdmin");
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const admin = await AdminModel.create({
    identifiant: req.body.identifiant,
    password: hashedPassword,
  });
  res.status(200).json(admin);
  console.log(res.status);
};

//connexion au compte vérification des informations
module.exports.authorisations = async (req, res) => {
  console.log("authorisations");
  const { identifiant, password } = req.body;

  const admin = await AdminModel.findOne({
    identifiant: identifiant,
  });
  console.log(admin);
  // cryptage du mot de passe avec bcrypt
  // également générer un token jwt
  if (!admin) {
    res.status(400).json({ message: "Email ou mot de passe invalide" });
    console.log(res + res.status(400) + "erreur ligne 20");
  }
  // Vérification du mot de passe avec bcrypt
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    console.log(isPasswordValid);
    console.log(res + res.status(400) + "erreur ligne45");
    return res.status(400).json({ message: "Email ou mot de passe invalide" });
  }
  // Génération du token JWT
  const token = jwt.sign(
    { identifiant: admin.identifiant },
    "clé secrète du token",
    {
      expiresIn: "1h",
    }
  );
  console.log("le token est ici   " + token + "   stop ici!");

  // Concaténer le token avec l'identifiant de session
  const dynamicSecret = token;

  console.log(dynamicSecret);

  res.setHeader("Authorization", `Bearer ${dynamicSecret}`);
  res.status(200).json({
    message: "Connexion réussie",
    identifiant: {
      identifiant: admin.identifiant,
    },
    token: dynamicSecret, // ajout du token dans la réponse pour le récupérer côté front-end
  });
  console.log(res + res.status(200) + "réussi");
};

//renvoi du token coté front-end
module.exports.getAdminInfo = async (req, res) => {
  console.log(" function getAdminInfo éxécutée");
  console.log(req);
  const authoHeader = req.headers.authorization;

  if (!authoHeader) {
    return res.status(401).json({
      message: "Pas de token d'authentification fourni : " + authoHeader,
    });
  }
  console.log(res);
  console.log(req);

  const token = authoHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "clé secrète du token");
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token d'authentification invalide" });
  }

  const adminIdentifiant = decodedToken.identifiant;
  const admin = await AdminModel.findOne({ identifiant: adminIdentifiant });
  console.log(admin);
  if (!admin) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }
  console.log(res);

  const identifiant = admin;

  res.status(200).json({ identifiant, token });
};
