const _User = require("../models/user.Model");
const verfyEmail = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await _User.findOne({ phone });
    if (user.isVerify) {
      return next();
    } else {
      return res.status(404).json({
        message: "Your Account Is Not Verify!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
module.exports = {
  verfyEmail,
};
