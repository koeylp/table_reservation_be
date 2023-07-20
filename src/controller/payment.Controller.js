const paypal = require("paypal-rest-sdk");
const { addReservation } = require("../service/reservations.Service");

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
    const { phone } = req.payload;
    const { tables, arrivalTime, fullName, phoneReserve } = req.body;
    console.log(req.body);
    total = amount;
    const paymentData = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:7070/payment/success`,
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
          custom: JSON.stringify({
            phone,
            tables,
            arrivalTime,
            fullName,
            phoneReserve,
          }),
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
      async function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          const dataAdd = JSON.parse(payment.transactions[0].custom);
          console.log(dataAdd);
          let phone = dataAdd.phone;
          let tables = dataAdd.tables;
          let arrivalTime = dataAdd.arrivalTime;
          let fullName = dataAdd.fullName;
          let phoneReserve = dataAdd.phoneReserve;
          console.log("Phone:", fullName, phoneReserve);
          if (phone && tables && fullName && phoneReserve) {
            try {
              const reservation = await addReservation({
                phone,
                tables,
                arrivalTime,
                fullName,
                phoneReserve,
              });
              const redirectURL = `http://localhost:5173/orderConfirm?reservation=${encodeURIComponent(
                JSON.stringify(reservation)
              )}`;
              res.redirect(redirectURL);
            } catch (error) {
              console.error(error);
              res
                .status(500)
                .json({ error: "An error occurred during reservation." });
            }
          } else {
            res
              .status(400)
              .json({ error: "Missing phone or tables information." });
          }
        }
      }
    );
  },
});
