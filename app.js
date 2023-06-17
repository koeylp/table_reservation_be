const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routerMain = require("./routes/main.Router");
const db = require("./config/dbConfig");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
db.connect();
routerMain(app);

app.use((error, req, res, next) => {
  res.status(error.status || 400).send({
    error: {
      code: error.code || 500,
      message: error.message || "Internal Server Error",
    },
  });
});
module.exports = app;
