const express = require("express");
const router = express.Router();
const reservationController = require("../controller/reservation.Controller");
const {
  verifyAccessTokenCookie,
  verifyAccessTokenCookieAdmin,
} = require("../config/accessToken");

router.post("/", verifyAccessTokenCookie, reservationController.addReservaion);
router.get("/getAll", reservationController.getAllReservation);
router.get(
  "/",
  verifyAccessTokenCookie,
  reservationController.getReservationByUser
);
router.put(
  "/",
  verifyAccessTokenCookie,
  reservationController.cancelReservation
);
router.get(
  "/getReservation",
  verifyAccessTokenCookieAdmin,
  reservationController.getReservationByTable
);

module.exports = router;
