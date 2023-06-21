const JWT = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();

const generateAccessToken = async ({ phone, email, customerId, fullName }) => {
  return new Promise(async (resolve, reject) => {
    const payload = {
      phone,
      email,
      customerId,
      fullName,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    JWT.sign(payload, SECRET_KEY, (err, token) => {
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
      console.log(err);
      if (err.name === "JsonWebTokenError") {
        return next(createError.Unauthorized());
      }
      return next(createError.Unauthorized(err.message));
    }
    req.payload = payload;
    next();
  });
};
const verifyAccessTokenFromCookie = (req, res, next) => {
  const { token } = req.cookies;
  JWT.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return reject(createError.Unauthorized());
      }
      console.log(err);
      return reject(createError.Unauthorized(err.message));
    }
    req.payload = payload;
  });
  next();
};
const verifyAccessTokenCookie = (token) => {
  return new Promise(async (resolve, reject) => {
    console.log(token);
    console.log(process.env.SECRET_KEY);
    JWT.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return reject(createError.Unauthorized());
        }
        console.log(err);
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
  verifyAccessTokenCookie,
};
