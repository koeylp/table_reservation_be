const express = require("express");
const router = express.Router();
const reservationController = require("../controller/reservation.Controller");
const {
  verifyAccessToken,
  verifyAccessTokenFromCookie,
} = require("../config/accessToken");

router.post(
  "/add",
  verifyAccessTokenFromCookie,
  reservationController.addReservaion
);
router.get(
  "/getAll",
  verifyAccessTokenFromCookie,
  reservationController.getAllReservation
);
router.get(
  "/",
  verifyAccessTokenFromCookie,
  reservationController.getReservationByUser
);

module.exports = router;
