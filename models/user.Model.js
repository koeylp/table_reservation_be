const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  phone: { type: String, require: true, unique: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  fullname: { type: String, require: true },
  transactionHistories: [
    {
      transaction: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "TransactionHistories",
      },
    },
  ],
  status: { type: Number, default: 1 },
});

module.exports = mongoose.model("Users", userSchema);
