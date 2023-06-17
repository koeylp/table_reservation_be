const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, require: true, ref: "User" },
  tables: [{ type: Schema.Types.ObjectId, require: true, ref: "Table" }],
  depositAmount: { type: mongoose.Types.Decimal128, require: true },
  arrivalTime: { type: Date, require: true },
  isCancelled: { type: Boolean, require: true },
});

module.exports = mongoose.model("Reservation", reservationSchema);
