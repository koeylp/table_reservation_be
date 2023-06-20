const express = require("express");
const router = express.Router();
const userController = require("../controller/user.Controller");
const {
  verifyAccessToken,
  verifyAccessTokenFromCookie,
} = require("../config/accessToken");

router.get("/:phone", userController.getUserByPhone);
router.get("/userInfor", verifyAccessTokenFromCookie, userController.getUser);

module.exports = router;
