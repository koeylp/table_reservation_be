const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, require: true, ref: "Users" },
    tables: [
      { table: { type: Schema.Types.ObjectId, require: true, ref: "Tables" } },
    ],
    fullName: { type: String, require: true },
    phone: { type: Number, require: true },
    depositAmount: { type: mongoose.Types.Decimal128, require: true },
    arrivalTime: { type: String, require: true },
    isCancelled: { type: Boolean, require: true, default: "false" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservations", reservationSchema);
