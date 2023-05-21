const express = require("express");
const {
  setOrders,
  getOrders,
  getOrderById,
} = require("../controllers/order.controller");
const router = express.Router();

router.get("/", getOrders);

router.get("/byId", getOrderById);

router.post("/setUsers", setOrders);

module.exports = router;
