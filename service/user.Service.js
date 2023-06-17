const _User = require("../models/user.Model");
const createError = require("http-errors");
const { hashPassword } = require("../config/hasingCode");
var that = (module.exports = {
  addUser: async ({ phone, email, password, fullName }) => {
    return new Promise(async (resolve, reject) => {
      const userCheck = await _User.findOne({
        phone: phone,
      });
      if (!userCheck) {
        const hasingPassword = await hashPassword(password);
        const user = await _User.create({
          phone,
          email,
          password: hasingPassword,
          fullName,
        });
        user ? resolve(user) : reject(new createError(404, "Cannot Add User"));
      }
      reject(new createError(404, "Phone is already in use!"));
    });
  },
  getTransactionHistory: async ({ phone }) => {
    return new Promise(async (resolve, reject) => {
      await _User
        .findOne({ phone })
        .then((user) => {
          const listTransactionHistory = user.transactionHistories;
          resolve(listTransactionHistory);
        })
        .catch((error) => {
          reject(new createError(404, "You Dont Have Any Reservation!"));
        });
    });
  },
});
