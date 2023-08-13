const express = require("express");
//const multer = require('multer');

//const upload = multer({dest: "uploads"})

const {
  setUploads,
  getUploads,
  getUploadsById,
  deleteUploads,
} = require("../controllers/uploads.controller");
const router = express.Router();

router.get("/", getUploads);

router.get("/:id", getUploadsById);

router.post("/", setUploads);

router.delete("/:id", deleteUploads);

module.exports = router;
