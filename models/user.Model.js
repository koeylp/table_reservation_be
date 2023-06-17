const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  phone: { type: String, require: true },
  fullname: { type: String, require: true },
  transactionHistories: [
    { Type: Schema.Types.ObjectId, require: true, ref: "TransactionHistory" },
  ],
});

module.exports = mongoose.model("User", userSchema);
