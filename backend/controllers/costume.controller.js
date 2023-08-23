const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CostumeModel = require("../models/costume.model");

// Configuration de multer pour gérer l'upload des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Créez une instance de multer avec la configuration
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error("Format d'image non supporté"), false); // Refuser le fichier
  }
};

// Créez une instance de multer avec la configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

//controller pour afficher les infos de la bdd
module.exports.getCostumes = async (req, res) => {
  const costumes = await CostumeModel.find();
  res.status(200).json(costumes);
};

module.exports.getCostumeByTitle = async (req, res) => {
  const { titre } = req.params;
  const costume = await CostumeModel.findOne({ titre });
  if (!costume) {
    return res.status(404).json({ message: "ce costume n'existe pas" });
  }
  return res.status(200).json(costume);
};

// Contrôleur pour créer un costume
// module.exports.setCostumes = async (req, res) => {
// const costume = await CostumeModel.create({
// titre: req.body.titre,
// description: req.body.description,
// imageUne: req.body.imageUne,
// imageDeux: req.body.imageDeux,
// prix: req.body.prix,
// });
// res.status(200).json(costume);
// };

module.exports.setCostumes = async (req, res) => {
  try {
    // Utilisez l'upload Multer pour gérer les deux images
    upload.fields([
      { name: "imageUne", maxCount: 1 },
      { name: "imageDeux", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // Gérer les erreurs de téléchargement Multer
        return res.status(500).json({ error: err.message });
      } else if (err) {
        // Gérer les autres erreurs
        return res.status(500).json({ error: err.message });
      }

      // Les fichiers ont été téléchargés avec succès, vous pouvez maintenant créer le costume
      const costume = await CostumeModel.create({
        titre: req.body.titre,
        description: req.body.description,
        imageUne: req.files["imageUne"][0].filename, // Utilisez req.files pour accéder aux fichiers téléchargés
        imageDeux: req.files["imageDeux"][0].filename,
        prix: req.body.prix,
      });

      res.status(200).json(costume);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
  try {
    console.log("function deletecostume appelée");
    const { titre } = req.params;
    console.log("titre du costume à supprimer: " + titre);
    const costume = await CostumeModel.deleteOne({ titre: titre });
    console.log("costume supprimé: " + costume);
    if (!costume || costume.deletedCount === 0) {
      console.log("erreur ici" + res + " " + req);
      return res.status(404).json({ error: "Costume introuvable" });
    }
    res.status(200).json({ message: "Costume supprimé", params: req.params });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
