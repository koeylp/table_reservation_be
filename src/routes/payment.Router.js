const express = require("express");
const paymentController = require("../controller/payment.Controller");
const router = express.Router();
const { verifyAccessTokenCookie } = require("../config/accessToken");

// Mount the payment controller routes
router.post(
  "/init",
  verifyAccessTokenCookie,
  paymentController.initiatePayment
);
router.get("/success", paymentController.handlePaymentSuccess);

module.exports = router;
