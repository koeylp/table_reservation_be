const JWT = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = async ({ phone, fullName }) => {
  return new Promise(async (resolve, reject) => {
    const payload = {
      phone,
      fullName,
    };
    const options = {
      expiresIn: "5h",
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    JWT.sign(payload, SECRET_KEY, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
const verifyAccessTokenCookieAdmin = (req, res, next) => {
  try {
    const { tokenReservationAdmin } = req.cookies;
    if (tokenReservationAdmin) {
      JWT.verify(
        tokenReservationAdmin,
        process.env.SECRET_KEY,
        (err, payload) => {
          if (err) {
            if (err.name === "TokenExpiredError") {
              return res.status(401).json({
                message: "Token expired",
              });
            } else {
              return res.status(401).json({
                message: "Invalid token",
              });
            }
          }
          console.log(payload);
          if (
            payload.phone === "0355350705" &&
            payload.fullName === "DATHANGNHANH@GMAIL.COM"
          ) {
            return next();
          } else {
            return res.status(401).json({
              message: "Invalid Role",
            });
          }
        }
      );
    } else {
      return res.status(401).json({
        message: "No token found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const verifyAccessTokenCookie = (req, res, next) => {
  try {
    const { tokenReservation } = req.cookies;
    if (tokenReservation) {
      JWT.verify(tokenReservation, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({
              message: "Token expired",
            });
          } else {
            return res.status(401).json({
              message: "Invalid token",
            });
          }
        }
        req.payload = payload;
        return next();
      });
    } else {
      return res.status(401).json({
        message: "No token found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
module.exports = {
  generateAccessToken,
  verifyAccessTokenCookie,
  verifyAccessTokenCookieAdmin,
};
