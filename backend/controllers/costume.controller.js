const CostumeModel = require("../models/costume.model");

//controller pour afficher les infos de la bdd
module.exports.getCostumes = async (req, res) => {
  const costumes = await CostumeModel.find();
  res.status(200).json(costumes);
};

module.exports.getCostumeByTitle = async (req, res) => {
  const { titre } = req.query;
  const costume = await CostumeModel.findOne({ titre });
  if (!costume) {
    return res.status(404).json({ message: "ce costume n'existe pas" });
  }
  return res.status(200).json(costume);
};
//controller pour créer un costume
module.exports.setCostumes = async (req, res) => {
  const costume = await CostumeModel.create({
    titre: req.body.titre,
    description: req.body.description,
    imageUne: req.body.imageUne,
    imageDeux: req.body.imageDeux,
    prix: req.body.prix,
  });
  res.status(200).json(costume);
};

//controller pour modifier les infos
module.exports.editCostume = async (req, res) => {
  const costume = await CostumeModel.findById(req.params.id);

  if (!costume) {
    res.status(400).json({ message: "Ce costume n'existe pas" });
  }

  const updateCostume = await CostumeModel.findByIdAndUpdate(
    costume,
    req.body,
    { new: true }
  );
  res.status(200).json(updateCostume);
};

module.exports.deleteCostume = async (req, res) => {
  const costume = await CostumeModel.findByIdAndDelete(req.params.id);
  if (!costume) {
    return res.status(404).json({ error: "Costume introuvable" });
  }
  try {
    await costume.remove();
    res.status(200).json("Costume supprimé" + req.params.id);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
