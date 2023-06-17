const express = require("express");
const router = express.Router();
const systemController = require("../controller/system.Controller");

router.post("/login", systemController.login);
router.post("/register", systemController.register);

module.exports = router;
