const { getTransactionHistory } = require("../service/user.Service");
var that = (module.exports = {
  /* getTransactionHistory: async (req, res, next) => {
    try {
      const { phone } = req.payload;
      const listTransactionHistory = await getTransactionHistory({ phone });
      if (listTransactionHistory) {
        return res.status(200).json({
          message: "List Transaction History!",
          listTransactionHistory: listTransactionHistory,
        });
      }
    } catch (error) {
      next(error);
    }
  }, */
});
