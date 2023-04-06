const UserModel = require("../models/user.model");

//controller pour afficher les infos de la bdd
module.exports.getUsers = async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
};

//controller pour créer un costume
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

  const updateUser = await UserModel.findByIdAndUpdate(user, req.body, {
    new: true,
  });
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
