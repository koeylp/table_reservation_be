const JWT = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();

const generateAccessToken = async ({ phone, email, customerId }) => {
  return new Promise(async (resolve, reject) => {
    const payload = {
      phone,
      email,
      customerId,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const options = {
      expiresIn: "1y",
      algorithm: "HS256",
    };
    JWT.sign(payload, SECRET_KEY, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  JWT.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return next(createError.Unauthorized());
      }
      return next(createError.Unauthorized(err.message));
    }
    req.payload = payload;
    next();
  });
};
const verifyAccessTokenFromCookie = (token) => {
  return new Promise(async (resolve, reject) => {
    JWT.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return reject(createError.Unauthorized());
        }
        return reject(createError.Unauthorized(err.message));
      }
      resolve(payload);
    });
  });
};
module.exports = {
  generateAccessToken,
  verifyAccessToken,
  verifyAccessTokenFromCookie,
};
