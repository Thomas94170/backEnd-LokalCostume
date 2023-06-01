const express = require("express");
const {
  setOrders,
  getOrders,
  getOrderById,
} = require("../controllers/order.controller");
const router = express.Router();

router.get("/", getOrders);

router.get("/:userId", getOrderById);

router.post("/setOrders", setOrders);

module.exports = router;
