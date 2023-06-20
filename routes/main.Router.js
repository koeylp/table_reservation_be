const userRouter = require("./user.Router");
const tableRouter = require("./table.Router");
const systemRouter = require("./system.Router");
const reservationRouter = require("./reservation.Router");
const paymentRouter = require("./payment.Router");
function router(app) {
  app.use("/user", userRouter);
  app.use("/table", tableRouter);
  app.use("/reservation", reservationRouter);
  app.use("/", systemRouter);
  app.use("/payment", paymentRouter)
}

module.exports = router;
