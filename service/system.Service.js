const _User = require("../models/user.Model");
const { generateAccessToken } = require("../config/accessToken");
const { comparePassword } = require("../config/hasingCode");
const createError = require("http-errors");

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
});
