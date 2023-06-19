const _User = require("../models/user.Model");
const { generateAccessToken } = require("../config/accessToken");
const { comparePassword } = require("../config/hasingCode");
const createError = require("http-errors");
require("dotenv").config();

var that = (module.exports = {
  login: async ({ phone, password }) => {
    return new Promise(async (resolve, reject) => {
      await _User
        .findOne({
          phone,
          status: 1,
        })
        .then(async (userForLogin) => {
          const isvaLid = await comparePassword({
            password,
            hashpassword: userForLogin.password,
          });
          if (isvaLid) {
            const token = await generateAccessToken({
              phone: userForLogin.phone,
              email: userForLogin.email,
              customerId: userForLogin._id,
            });
            token
              ? resolve(token)
              : reject(new createError(404, "Cannot Login To System Token!"));
          } else {
            reject(new createError(404, "Cannot Login To System Password!"));
          }
        })
        .catch((error) =>
          reject(new createError(404, "Cannot Login To System!"))
        );
    });
  },
  loginStaff: async ({ phone, password }) => {
    return new Promise(async (resolve, reject) => {
      if (phone === process.env.PHONE && password === process.env.PASSWORD) {
        const token = await generateAccessToken({
          phone: phone,
          email: password,
        });
        token
          ? resolve(token)
          : reject(new createError(404, "Cannot Login To System Token!"));
      }
    });
  },
});
