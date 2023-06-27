const express = require("express");

const {
  getAdmins,
  setAdmins,
  authorisations,
  getAdminInfo,
} = require("../controllers/admin.controller");
const router = express.Router();

router.get("/", getAdmins);

router.post("/setAdmins", setAdmins);

router.post("/authorisations", authorisations);

router.post("/getAdminInfo", getAdminInfo);

module.exports = router;
