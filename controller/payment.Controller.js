const express = require("express");
const paypal = require("paypal-rest-sdk");

// Configure PayPal SDK
paypal.configure({
  mode: "sandbox", // or 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

let total = 0;

var that = (module.exports = {
  initiatePayment: async (req, res) => {
    const { amount, currency, itemName } = req.body;
    total = amount;
    const paymentData = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/",
        cancel_url: "http://localhost:5173/",
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
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        console.error("Error creating PayPal payment:", error);
        res.status(500).json({ error: "Failed to initiate payment" });
      } else {
        // Extract the approval URL from the payment response
        const approvalUrl = payment.links.find(
          (link) => link.rel === "approval_url"
        ).href;
        res.json({ approvalUrl });
        console.log(approvalUrl);
      }
    });
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
            total: total,
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
  handlePaymentFailure: async (req, res) => {
    res.send("Payment failed");
  },
});
