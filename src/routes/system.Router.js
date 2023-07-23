const express = require("express");
const router = express.Router();
const systemController = require("../controller/system.Controller");
const { verfyEmail } = require("../middleware/loginMiddleWare");

router.post("/login", verfyEmail, systemController.login);
router.post("/staffLogin", systemController.staffLogin);
router.post("/logout", systemController.logout);
router.post("/register", systemController.register);
router.get("/verifyEmail", systemController.verfyEmail);

module.exports = router;
