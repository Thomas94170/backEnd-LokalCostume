const express = require("express");
const {
  setCostumes,
  getCostumes,
  editCostume,
  deleteCostume,
} = require("../controllers/costume.controller");
const router = express.Router();

router.get("/", getCostumes);

router.post("/", setCostumes);

router.put("/:id", editCostume);

router.delete("/:id", deleteCostume);

module.exports = router;
