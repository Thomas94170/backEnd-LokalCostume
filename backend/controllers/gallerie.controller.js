const GallerieModel = require("../models/gallerie.model");

//controller pour afficher les infos de la bdd
module.exports.getGalleries = async (req, res) => {
  const galleries = await GallerieModel.find();
  res.status(200).json(galleries);
};

//controller pour créer un costume
module.exports.setGalleries = async (req, res) => {
  const gallerie = await GallerieModel.create({
    imageGallerie: req.body.imageGallerie,
  });
  res.status(200).json(gallerie);
};

//controller pour modifier les infos
module.exports.editGallerie = async (req, res) => {
  const gallerie = await GallerieModel.findById(req.params.id);

  if (!gallerie) {
    res.status(400).json({ message: "Cette image n'existe pas" });
  }

  const updateGallerie = await GallerieModel.findByIdAndUpdate(
    gallerie,
    req.body,
    { new: true }
  );
  res.status(200).json(updateGallerie);
};

module.exports.deleteGallerie = async (req, res) => {
  const gallerie = await GallerieModel.findByIdAndDelete(req.params.id);
  if (!gallerie) {
    return res.status(404).json({ error: "Image introuvable" });
  }
  try {
    await gallerie.remove();
    res.status(200).json("Image supprimé" + req.params.id);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
