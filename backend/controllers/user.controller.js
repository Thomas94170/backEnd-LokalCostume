const UserModel = require("../models/user.model");

//controller pour afficher les infos de la bdd
module.exports.getUsers = async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
};

//controller pour verifier les informations lors de la connexion à mon compte
module.exports.checkCredentials = async (req, res) => {
  const { email, mdp } = req.body;

  const user = await UserModel.findOne({ email, mdp });

  if (!user) {
    res.status(400).json({ message: "Email ou mot de passe invalide" });
  } else {
    res.status(200).json({ message: "Connexion réussie" });
  }
};

//controller pour créer un user
module.exports.setUsers = async (req, res) => {
  const user = await UserModel.create({
    prenom: req.body.prenom,
    nom: req.body.nom,
    email: req.body.email,
    mdp: req.body.mdp,
  });
  res.status(200).json(user);
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
