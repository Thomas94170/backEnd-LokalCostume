const express = require("express");
const {
  setUsers,
  getUsers,
  editUser,
  deleteUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.get("/", getUsers);

router.post("/", setUsers);

router.put("/:id", editUser);

router.delete("/:id", deleteUser);

module.exports = router;
