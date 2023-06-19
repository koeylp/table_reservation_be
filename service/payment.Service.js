const paypal = require("paypal-rest-sdk");

// Configure PayPal SDK
paypal.configure({
  mode: "sandbox", // or 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

var that = (module.exports = {
  initiatePayment: async (paymentData) => {
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
});

// Service method for initiating a payment
// const initiatePayment = (req, res) => {
//   const { amount, itemName } = req.body;
//   const create_payment_json = {
//     intent: "sale",
//     payer: {
//       payment_method: "paypal",
//     },
//     redirect_urls: {
//       return_url: "http://localhost:3000/success",
//       cancel_url: "http://localhost:3000/cancel",
//     },
//     transactions: [
//       {
//         item_list: {
//           items: [
//             {
//               name: itemName,
//               sku: "001",
//               price: amount,
//               currency: "USD",
//               quantity: 1,
//             },
//           ],
//         },
//         amount: {
//           currency: "USD",
//           total: amount,
//         },
//         description: "Hat for the best team ever",
//       },
//     ],
//   };

//   paypal.payment.create(create_payment_json, function (error, payment) {
//     if (error) {
//       throw error;
//     } else {
//       for (let i = 0; i < payment.links.length; i++) {
//         if (payment.links[i].rel === "approval_url") {
//           res.redirect(payment.links[i].href);
//         }
//       }
//     }
//   });
// };

// // Service method for handling payment success callback
// const handlePaymentSuccess = (req, res) => {
  // const payerId = req.query.PayerID;
  // const paymentId = req.query.paymentId;

  // const execute_payment_json = {
  //   payer_id: payerId,
  //   transactions: [
  //     {
  //       amount: {
  //         currency: "USD",
  //         total: "25.00",
  //       },
  //     },
  //   ],
  // };

  // paypal.payment.execute(
  //   paymentId,
  //   execute_payment_json,
  //   function (error, payment) {
  //     if (error) {
  //       console.log(error.response);
  //       throw error;
  //     } else {
  //       console.log(JSON.stringify(payment));
  //       res.send("Success");
  //     }
  //   }
  // );
// };

// // Service method for handling payment failure callback
// const handlePaymentFailure = (req, res) => {
//   res.send("Payment failed");
// };

// module.exports = {
//   initiatePayment,
//   handlePaymentSuccess,
//   handlePaymentFailure,
// };
