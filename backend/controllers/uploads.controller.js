const multer = require("multer");
const path = require("path");

const GallerieModel = require("../models/gallerie.model");

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

module.exports.setUploads = async (req, res) => {
  console.log("function setUploads appelée");
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

//controller pour afficher les infos de la bdd
module.exports.getUploads = async (req, res) => {
  const galleries = await GallerieModel.find();
  res.status(200).json(galleries);
};

module.exports.getUploadsById = async (req, res) => {
  try {
    const gallerieId = req.params.id; // Récupère l'ID de la galerie depuis les paramètres de la requête
    const gallerie = await GallerieModel.findById(gallerieId);

    if (!gallerie) {
      return res.status(404).json({ message: "Image non trouvée" });
    }

    res.status(200).json(gallerie);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de l image",
    });
  }
};

//suppression de l'uploads
module.exports.deleteUploads = async (req, res) => {
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
