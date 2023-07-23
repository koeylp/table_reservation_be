const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  phone: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  fullName: { type: String, require: true },
  tokenEmail: { type: String, require: true },
  isVerify: { type: Boolean, default: false },
  status: { type: Number, default: 1 },
});

module.exports = mongoose.model("Users", userSchema);
