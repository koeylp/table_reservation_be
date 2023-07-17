const express = require("express");
const router = express.Router();
const userController = require("../controller/user.Controller");

router.get("/:phone", userController.getUserByPhone);

module.exports = router;
