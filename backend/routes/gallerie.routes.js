const express = require("express");
const {
  setGalleries,
  getGalleries,
  getGallerieById,
  editGallerie,
  deleteGallerie,
} = require("../controllers/gallerie.controller");
const router = express.Router();

router.get("/", getGalleries);

router.get("/:id", getGallerieById);

router.post("/", setGalleries);

router.put("/:id", editGallerie);

router.delete("/:id", deleteGallerie);

module.exports = router;
