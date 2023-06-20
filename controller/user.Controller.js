const { getUserByPhone } = require("../service/user.Service");
const createError = require("http-errors");
var that = (module.exports = {
  getUserByPhone: async (req, res, next) => {
    try {
      const { phone } = req.params;
      if (!phone) throw createError(404, "Phone is required!");
      const user = await getUserByPhone({ phone });
      if (user) {
        return res.status(200).json({
          message: "Get User By Phone!",
          user: user,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { phone, email, customerId } = req.payload;
      return res.status(200).json({
        phone: phone,
        email: email,
        customerId: customerId,
      });
    } catch (error) {
      next(error);
    }
  },
});
