const _User = require("../models/user.Model");
const createError = require("http-errors");
const { hashPassword } = require("../config/hasingCode");
const crypto = require("crypto");
const { sendMail } = require("../config/sendEmail");

var that = (module.exports = {
  addUser: async ({ phone, email, password, fullName }) => {
    return new Promise(async (resolve, reject) => {
      const userCheck = await _User.findOne({
        phone: phone,
      });
      const mailCheck = await _User.findOne({
        email: email,
      });
      if (mailCheck) {
        reject(new createError(404, "Email is already in use!"));
      }
      if (!userCheck) {
        const hasingPassword = await hashPassword(password);
        const tokenEmail = crypto.randomBytes(64).toString("hex");
        const user = await _User.create({
          phone,
          email,
          password: hasingPassword,
          fullName,
          tokenEmail,
        });
        const mailOptions = {
          from: '"Verify Your Email" <yummypotsogood@gmail.com>',
          to: `${email}`,
          subject: " Hello From Yummy Pot!",
          text: "You Are Here",
          html: `<div style="background-color:orange;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
        <div style="width: 50%; background-color: whitesmoke;padding: 10px 30px;">
            <h1 style="text-align: center;">Welcome!</h1>
            <h4 style="margin-top:30px; font-weight: 300; ">YummyPot is excited to have you get started. First, you need to confirm your account. Just press the button below </h4>
            <div style="display: flex;justify-content: center;margin-top:30px">
                <button style="background-color: rgb(255,167,59);border: none;color: whitesmoke;padding: 10px 20px;font-size: 15px;"><a href="http://localhost:7070/verifyEmail?token=${tokenEmail}" >Verify Here...</a></button>
            </div>
            <h4 style="margin-top:30px; font-weight: 300;">If does not work, come back to our Website....
            </h4>
            
        </div>
    </div>`,
        };
        sendMail(mailOptions)
          .then((resule) => console.log("Email Send: ", resule))
          .catch((error) => console.log(error));
        user ? resolve(user) : reject(new createError(404, "Cannot Add User"));
      }
      reject(new createError(404, "Phone is already in use!"));
    });
  },
  getUserByPhone: async ({ phone }) => {
    return new Promise(async (resolve, reject) => {
      await _User
        .findOne({ phone })
        .then((user) => resolve(user))
        .catch((error) =>
          reject(new createError(404, `Not Found User With ${phone}`))
        );
    });
  },
  verfyEmail: async ({ token }) => {
    return new Promise(async (resolve, reject) => {
      await _User
        .findOneAndUpdate(
          { tokenEmail: token },
          { $set: { isVerify: true } },
          { new: true }
        )
        .then((user) => {
          resolve(user);
        })
        .catch((error) => reject(new createError(404, "Cannot Verify Email!")));
    });
  },
});
