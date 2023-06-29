const multer = require("multer");
const path = require("path");

const GallerieModel = require("../models/gallerie.model");

//controller pour afficher les infos de la bdd
module.exports.getGalleries = async (req, res) => {
  const galleries = await GallerieModel.find();
  res.status(200).json(galleries);
};

// Configuration de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Spécifiez le dossier où vous souhaitez enregistrer les fichiers téléchargés
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Générez un nom de fichier unique pour éviter les conflits
  },
});

// Créez une instance de multer avec la configuration
const upload = multer({ storage: storage });

//controller pour créer une image

module.exports.setGalleries = async (req, res) => {
  console.log("function setGalleries appelée");
  try {
    // Utilisez le middleware de téléchargement Multer pour gérer le fichier téléchargé
    upload.single("imageGallerie")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Gérez les erreurs de téléchargement Multer
        console.log("message de res" + res);
        return res.status(500).json({ error: err.message });
      } else if (err) {
        // Gérez les autres erreurs
        return res
          .status(500)
          .json({ error: err.message + " message d'erreur" });
      }

      // Le fichier a été téléchargé avec succès, vous pouvez maintenant créer une image
      const gallerie = await GallerieModel.create({
        imageGallerie: req.file.filename, // Utilisez req.file.filename pour obtenir le nom du fichier téléchargé
      });
      res.status(200).json(gallerie);
      console.log("succès " + res);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//module.exports.setGalleries = async (req, res) => {
//  const gallerie = await GallerieModel.create({
//    imageGallerie: req.body.imageGallerie,
//  });
//  res.status(200).json(gallerie);
//};

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
  const { id } = req.params;
  // eslint-disable-next-line no-undef
  const gallerie = await GallerieModel.deleteOne({ _id: id });
  if (!gallerie) {
    return res.status(404).json({ error: "Image introuvable" });
  }
  try {
    // await gallerie.remove();
    res.status(200).json("Image supprimé" + req.params.id);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
