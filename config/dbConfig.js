const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TableReservation", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("Connecting database Fail !!");
  }
}
mongoose.connection.on("connected", () => {
  console.log("Connect successfully!!");
});
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected!!");
});
mongoose.connection.on("error", (error) => {
  console.log(error);
});
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
module.exports = { connect };
