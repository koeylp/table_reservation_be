const express = require("express");
const paymentService = require("../service/payment.Service");
const router = express.Router();
const paypal = require("paypal-rest-sdk");

// Configure PayPal SDK
paypal.configure({
  mode: "sandbox", // or 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

var that = (module.exports = {
  initiatePayment: async (req, res) => {
    const { amount, currency, itemName } = req.body;

    const paymentData = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:7070/payment/success",
        cancel_url: "http://localhost:3000/payment/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: itemName,
                price: amount,
                currency: currency,
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: currency,
            total: amount,
          },
          description: "Payment description",
        },
      ],
    };
    paymentService.initiatePayment(paymentData);
  },
  handlePaymentSuccess: async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: amount,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          res.send("Success");
        }
      }
    );
  },
});

// router.get("/failure", paymentService.handlePaymentFailure);
