const multer = require("multer");
const path = require("path");
const fs = require("fs");

const GallerieModel = require("../models/gallerie.model");

// Configuration de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Spécifiez le dossier où vous souhaitez enregistrer les fichiers téléchargés
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Générez un nom de fichier unique pour éviter les conflits
  },
});

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
//module.exports.getUploads = async (req, res) => {
//  const galleries = await GallerieModel.find();
//  res.status(200).json(galleries);
//};

//module.exports.getUploads = async (req, res) => {
//  try {
//    const galleries = await GallerieModel.find();
//
//    res.status(200).json(galleries);
//  } catch (error) {
//    console.error(error);
//    res.status(500).json({
//     message: "Erreur serveur lors de la récupération des images!",
//   });
//  }
//};

// module.exports.getUploads = async (req, res) => {
//   console.log("getUploads appelée");
//   try {
//     const galleries = await GallerieModel.find();

//     const imagesList = galleries.map((gallery) => ({
//       url: `http://localhost:5400/uploads/${gallery.imageGallerie}`,
//     }));

//     res.status(200).json(imagesList);
//     console.log(imagesList);
//     console.log("getUploads fonctionne");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Erreur serveur lors de la récupération des images!",
//     });
//   }
// };
module.exports.getUploads = async (req, res) => {
  console.log("getUploads appelée");
  const uploads = await GallerieModel.find();
  res.status(200).json(uploads);
  console.log("éxécutée et traitée");
};

module.exports.getUploadsById = async (req, res) => {
  console.log("fnction getUploadsById appelée");
  try {
    const gallerieId = req.params.imageGallerie; // Récupère l'ID de la galerie depuis les paramètres de la requête
    //const gallerie = await GallerieModel.findById(gallerieId);
    const gallerie = await GallerieModel.findOne({ gallerieId });

    if (!gallerie) {
      return res.status(404).json({ message: "Image non trouvée" });
    }

    res.status(200).json(gallerie);
    console.log("elle fonctionne");
  } catch (error) {
    console.error(error + "voici le message");
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de l image",
    });
  }
};

//suppression de l'uploads
module.exports.deleteUploads = async (req, res) => {
  const { id } = req.params;
  const gallerie = await GallerieModel.findOne({ _id: id });

  if (!gallerie) {
    return res.status(404).json({ error: "Image introuvable" });
  }

  try {
    // Supprimer le fichier physique du système de fichiers
    const filePath = path.join("uploads", gallerie.imageGallerie);

    // Vérifier si le fichier existe avant de le supprimer
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer l'entrée de la base de données
    await gallerie.remove();

    res.status(200).json({ message: "Image supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
