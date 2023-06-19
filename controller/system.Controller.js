const { validateLogin, validateRegister } = require("../config/validate");
const { login, loginStaff } = require("../service/system.Service");
const { addUser } = require("../service/user.Service");
const createError = require("http-errors");

var that = (module.exports = {
  login: async (req, res, next) => {
    try {
      const { error } = validateLogin(req.body);
      if (error) throw createError(error.details[0].message);
      const { phone, password } = req.body;
      const token = await login({ phone, password });
      if (token) {
        res.cookie("token", token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });
        return res.status(200).json({
          token: token,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  register: async (req, res, next) => {
    try {
      const { error } = validateRegister(req.body);
      if (error) throw createError(error.details[0].message);
      const { phone, email, password, confirmPassword, fullName } = req.body;
      console.log("fullName", fullName);
      if (password != confirmPassword)
        throw createError("Conflict With Confirm Password!");
      const user = await addUser({
        phone,
        email,
        password,
        fullName,
      });
      if (user) {
        return res.status(200).json({
          message: "Add SuccessFullyy!!",
          data: user,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  staffLogin: async (req, res, next) => {
    try {
      const { error } = validateLogin(req.body);
      if (error) throw createError(error.details[0].message);
      const { phone, password } = req.body;
      const token = await loginStaff({ phone, password });
      if (token) {
        res.cookie("token", token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });
        return res.status(200).json({
          token: token,
        });
      }
    } catch (error) {
      next(error);
    }
  },
});
