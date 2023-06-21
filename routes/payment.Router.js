const express = require("express");
const paymentController = require("../controller/payment.Controller");
const router = express.Router();

// Mount the payment controller routes
router.post("/init", paymentController.initiatePayment);
router.get("/success", paymentController.handlePaymentSuccess);
router.get("/failure", paymentController.handlePaymentFailure);

module.exports = router;
