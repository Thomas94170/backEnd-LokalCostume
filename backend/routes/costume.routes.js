const express = require("express");
const {
  setCostumes,
  getCostumes,
  editCostume,
  deleteCostume,
  getCostumeByTitle,
} = require("../controllers/costume.controller");
const router = express.Router();

router.get("/", getCostumes);
router.get("/:titre", getCostumeByTitle);

router.post("/", setCostumes);

router.put("/:id", editCostume);

router.delete("/:id", deleteCostume);

module.exports = router;
