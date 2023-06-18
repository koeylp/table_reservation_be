const express = require("express");
const router = express.Router();
const reservationController = require("../controller/reservation.Controller");
const { verifyAccessToken } = require("../config/accessToken");

router.post("/add", verifyAccessToken, reservationController.addReservaion);
router.get(
  "/getAll",
  verifyAccessToken,
  reservationController.getAllReservation
);

module.exports = router;
