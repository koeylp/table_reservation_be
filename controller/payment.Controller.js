const express = require("express");
const paymentService = require("../service/payment.Service");
const router = express.Router();

// Route for initiating a payment
router.post("/", paymentService.initiatePayment);

// Route for handling payment success callback
router.get("/success", paymentService.handlePaymentSuccess);

// Route for handling payment failure callback
router.get("/failure", paymentService.handlePaymentFailure);

module.exports = router;
