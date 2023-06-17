const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  tableNumber: { type: Number, require: true },
  capacity: { type: Number, require: true },
  isAvailable: { type: Boolean, require: true, default: true },
  depositPrice: { type: mongoose.Types.Decimal128, require: true },
  timeRangeType: { type: String, require: true },
});

module.exports = mongoose.model("Tables", tableSchema);
