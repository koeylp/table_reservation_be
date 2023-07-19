const { validateLogin, validateRegister } = require("../config/validate");
const { login, loginStaff } = require("../service/system.Service");
const { addUser, verfyEmail } = require("../service/user.Service");
const createError = require("http-errors");

var that = (module.exports = {
  login: async (req, res, next) => {
    try {
      const { error } = validateLogin(req.body);
      if (error) throw createError(error.details[0].message);
      const { phone, password } = req.body;
      const token = await login({ phone, password });
      if (token) {
        res.cookie("tokenReservation", token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });
        res.status(200).json({
          token,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.cookie("tokenReservation", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      return res.status(200).json({
        message: "Logout Successfully! Good BYe!",
      });
    } catch (error) {
      next(error);
    }
  },
  register: async (req, res, next) => {
    try {
      const { error } = validateRegister(req.body);
      if (error) throw createError(error.details[0].message);
      const { phone, email, password, confirmPassword, fullName } = req.body;
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
        res.cookie("tokenReservationAdmin", token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: false,
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
  verfyEmail: async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token) {
        throw createError(400, "Bad Request!");
      }
      const user = verfyEmail({ token });
      if (user) {
        res.redirect("http://localhost:5173/login");
      }
    } catch (error) {
      next(error);
    }
  },
});
