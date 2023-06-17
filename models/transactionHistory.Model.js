const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionHistorySchema = new Schema({
  date: { type: Date, require: true },
  paymentType: { type: String, require: true },
  reservation: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Reservation",
  },
});

module.exports = mongoose.model("TransactionHistory", transactionHistorySchema);
