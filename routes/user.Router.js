const express = require("express");
const router = express.Router();
const userController = require("../controller/user.Controller");
const { verifyAccessToken } = require("../config/accessToken");

// router.get(
//   "/transactionHistory",
//   verifyAccessToken,
//   userController.getTransactionHistory
// );

module.exports = router;
