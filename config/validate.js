const joi = require("joi");
const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

const validateRegister = (data) => {
  const validateSchema = joi.object({
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "fpt", "edu", "vn", "gmail"] },
    }),
    password: joi.string().regex(RegExp(regex)).required(),
    confirmPassword: joi.string().regex(RegExp(regex)).required(),
    phone: joi.string().min(10).max(11).required(),
    fullName: joi.string().required(),
  });
  return validateSchema.validate(data);
};
const validateLogin = (data) => {
  const validateSchema = joi.object({
    phone: joi.string().required(),
    password: joi.string().required(),
  });
  return validateSchema.validate(data);
};
const validateTable = (data) => {
  const validateSchema = joi.object({
    tableNumber: joi.number().required(),
    capacity: joi.number().required(),
    depositPrice: joi.number().required(),
    timeRangeType: joi.string().required(),
  });
  return validateSchema.validate(data);
};
const validateTableUpdate = (data) => {
  const validateSchema = joi.object({
    tableNumber: joi.number().required(),
    capacity: joi.number().required(),
    depositPrice: joi.number().required(),
  });
  return validateSchema.validate(data);
};
module.exports = {
  validateLogin,
  validateRegister,
  validateTable,
  validateTableUpdate,
};
