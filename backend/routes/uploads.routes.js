const express = require("express");

const {
  setUploads,
  getUploads,
  getUploadsById,
  deleteUploads,
} = require("../controllers/uploads.controller");
const router = express.Router();

router.get("/", getUploads);

router.get("/:_id", getUploadsById);

router.post("/", setUploads);

router.delete("/:_id", deleteUploads);

module.exports = router;
