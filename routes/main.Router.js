const userRouter = require("./user.Router");
const tableRouter = require("./table.Router");
const systemRouter = require("./system.Router");
const paymentRouter = require("./payment.Router");
function router(app) {
  app.use("/user", userRouter);
  app.use("/table", tableRouter);
  app.use("/", systemRouter);
  app.use("/payment", paymentRouter)
}

module.exports = router;
