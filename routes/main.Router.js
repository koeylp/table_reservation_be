const userRouter = require("./user.Router");
const tableRouter = require("./table.Router");
const systemRouter = require("./system.Router");
function router(app) {
  app.use("/user", userRouter);
  app.use("/table", tableRouter);
  app.use("/", systemRouter);
}

module.exports = router;
