const express = require("express");
const paymentController = require("../controller/payment.Controller");
const router = express.Router();

// Mount the payment controller routes
router.use("/", paymentController);

module.exports = router;
