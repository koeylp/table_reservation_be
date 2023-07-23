const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRES = process.env.CLIENT_SECRES;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESHTOKEN = process.env.REFRESHTOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRES,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESHTOKEN });

async function sendMail(mailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "toanntse161325@fpt.edu.vn",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRES,
        refreshToken: REFRESHTOKEN,
        accessToken: accessToken,
      },
    });
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
module.exports = {
  sendMail,
};
