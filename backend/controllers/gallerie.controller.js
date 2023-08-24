const multer = require("multer");
const path = require("path");
const fs = require("fs");

const GallerieModel = require("../models/gallerie.model");

//controller pour afficher les infos de la bdd
// module.exports.getGalleries = async (req, res) => {
//   console.log("getGalleriess appelée");
//   try {
//     console.log("je rentre dans le try");
//     const galleries = await GallerieModel.find();
//     console.log("find utiliséé");
//     const imagesList = galleries.map((gallery) => ({
//       url: `http://localhost:5400/uploads/${gallery.imageGallerie}`,
//     }));

//     res.status(200).json(imagesList);
//     console.log("voici la liste : ");
//     console.log(imagesList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Erreur serveur lors de la récupération des images!",
//     });
//   }
// };

module.exports.getGalleries = async (req, res) => {
  console.log("getGaleries appelée");
  const galleries = await GallerieModel.find();
  res.status(200).json(galleries);
  console.log("function éxécutée");
};

//affichage selon id de l'image

module.exports.getGallerieById = async (req, res) => {
  console.log("getGallerieById appelée");
  try {
    const gallerieId = req.params._id; // Récupère l'ID de la galerie depuis les paramètres de la requête
    const gallerie = await GallerieModel.findById(gallerieId);
    // const gallerie = await GallerieModel.findOne({ imageGallerie: gallerieId });

    if (!gallerie) {
      return res.status(404).json({ message: "Image non trouvée" });
    }

    res.status(200).json(gallerie);
  } catch (error) {
    console.error(error + "voici le message");
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de l image!!!",
    });
  }
};

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

//module.exports.deleteGallerie = async (req, res) => {
//  console.log("fntion deleteGallerie appelée");
//  const { imageGallerie } = req.params;
// eslint-disable-next-line no-undef
//  const gallerie = await GallerieModel.deleteOne({
//    imageGallerie: imageGallerie,
//  });
//  if (!gallerie) {
//    return res.status(404).json({ error: "Image introuvable" });
//  }
//  try {
//await gallerie.remove();
//    res.status(200).json("Image supprimé" + req.params.imageGallerie);
//  } catch (err) {
//    res.status(500).json({ error: err.message });
//  }
//};

module.exports.deleteGallerie = async (req, res) => {
  console.log("Fonction deleteGallerie appelée");
  const { imageGallerie } = req.params;

  try {
    // Obtenez le chemin complet du fichier à partir de la base de données
    console.log("try ici");
    const filePath = path.join("uploads", imageGallerie);
    console.log(filePath);

    // Vérifiez si le fichier existe avant de le supprimer
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Supprimer le fichier du système de fichiers
      console.log("vérification ");
    }

    // Maintenant, vous pouvez supprimer le document de la base de données
    await GallerieModel.deleteOne({ imageGallerie: imageGallerie });
    console.log("delete utilisé");
    res.status(200).json("Image supprimée " + imageGallerie);
    console.log("image supprimé " + imageGallerie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
