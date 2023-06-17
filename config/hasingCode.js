const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashOtp = await bcrypt.hash(password, salt);
      resolve(hashOtp);
    } catch (error) {
      reject(error);
    }
  });
};
const comparePassword = async ({ password, hashpassword }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isvaLid = await bcrypt.compare(password, hashpassword);
      resolve(isvaLid);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  hashPassword,
  comparePassword,
};
