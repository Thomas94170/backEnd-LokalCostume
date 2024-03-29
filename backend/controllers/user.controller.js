const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

//controller pour afficher les infos de la bdd
module.exports.getUsers = async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
};

//controller pour verifier les informations lors de la connexion à mon compte!
module.exports.checkCredentials = async (req, res) => {
  console.log("checkCredentials");
  const { email, mdp } = req.body;

  const user = await UserModel.findOne({
    email: email,
  });
  console.log(user);
  // cryptage du mot de passe avec bcrypt
  // également générer un token jwt
  if (!user) {
    res.status(400).json({ message: "Email ou mot de passe invalide" });
    console.log(res + res.status(400) + "erreur ligne 20");
  }
  // Vérification du mot de passe avec bcrypt
  const isPasswordValid = await bcrypt.compare(mdp, user.mdp);
  if (!isPasswordValid) {
    console.log(isPasswordValid);
    console.log(res + res.status(400) + "erreur ligne26");
    return res.status(400).json({ message: "Email ou mot de passe invalide" });
  }
  // Génération du token JWT
  const token = jwt.sign({ email: user.email }, "clé secrète du token", {
    expiresIn: "1h",
  });
  console.log("le token est ici   " + token + "   stop ici!");

  // Concaténer le token avec l'identifiant de session
  const dynamicSecret = token;

  console.log(dynamicSecret);

  res.setHeader("Authorization", `Bearer ${dynamicSecret}`);
  res.status(200).json({
    message: "Connexion réussie",
    user: {
      id: user.id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
    },
    token: dynamicSecret, // ajout du token dans la réponse pour le récupérer côté front-end
  });
  console.log(res + res.status(200) + "réussi");
};

//controller pour récupérer les infos (toute les infos) du user connecté grâce au token
// si le user existe j'envoi le token généré coté front end
module.exports.getUserInfo = async (req, res) => {
  console.log("getUserInfo");
  console.log(req);
  const authHeader = req.headers.authorization;
  console.log(" l'en tête est ici : " + authHeader + " stop ici");
  if (!authHeader) {
    return res.status(401).json({
      message: "Pas de token d'authentification fourni : " + authHeader,
    });
  }
  console.log(res);
  console.log(req);

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "clé secrète du token");
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token d'authentification invalide" });
  }

  const userEmail = decodedToken.email;
  const user = await UserModel.findOne({ email: userEmail });
  console.log(user);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }
  console.log(res);

  const { id, prenom, nom, email } = user;

  res.status(200).json({ id, prenom, nom, email, token });
};

//controller pour créer un user
module.exports.setUsers = async (req, res) => {
  console.log("setUser");
  const hashedPassword = await bcrypt.hash(req.body.mdp, 10);
  const user = await UserModel.create({
    prenom: req.body.prenom,
    nom: req.body.nom,
    email: req.body.email,
    mdp: hashedPassword,
  });
  res.status(200).json(user);
  console.log(res.status);
};

//controller pour modifier les infos
module.exports.editUser = async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    res.status(400).json({ message: "Ce compte n'existe pas" });
  }

  const updateUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  console.log(req);
  res.status(200).json(updateUser);
};

module.exports.deleteUser = async (req, res) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Compte introuvable" });
  }
  try {
    await user.remove();
    res.status(200).json("Compte supprimé" + req.params.id);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
