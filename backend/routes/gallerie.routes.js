const express = require("express");
const {
  setGalleries,
  getGalleries,
  editGallerie,
  deleteGallerie,
} = require("../controllers/gallerie.controller");
const router = express.Router();

router.get("/", getGalleries);

router.post("/", setGalleries);

router.put("/:id", editGallerie);

router.delete("/:id", deleteGallerie);

module.exports = router;
