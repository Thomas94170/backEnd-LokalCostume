const express = require("express");
const {
  setUsers,
  getUsers,
  editUser,
  deleteUser,
  checkCredentials,
  getUserInfo,
} = require("../controllers/user.controller");
const router = express.Router();

router.get("/", getUsers);

router.post("/setUsers", setUsers);

router.post("/checkCredentials", checkCredentials);

router.post("/getUserInfo", getUserInfo);

router.put("/:id", editUser);

router.delete("/:id", deleteUser);

module.exports = router;
