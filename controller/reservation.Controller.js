const {
  addReservation,
  getAllReservation,
  getReservationByUser,
} = require("../service/reservations.Service");
const { verifyAccessTokenCookie } = require("../config/accessToken");
const createError = require("http-errors");
var that = (module.exports = {
  addReservaion: async (req, res, next) => {
    try {
      const { token } = req.body;
      const payload = await verifyAccessTokenCookie(token);
      const { customerId } = payload;
      const { tables, arrivalTime } = req.body;
      if (customerId && tables && arrivalTime) {
        const reservation = await addReservation({
          customerId,
          tables,
          arrivalTime,
        });
        if (reservation) {
          return res.status(200).json({
            message: "Reservation Successfully!",
            Your_Reservation: reservation,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  getAllReservation: async (req, res, next) => {
    try {
      const reservation = await getAllReservation();
      if (reservation) {
        return res.status(200).json({
          message: "Your List",
          ReservationList: reservation,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getReservationByUser: async (req, res, next) => {
    const { token } = req.body;

    const payload = await verifyAccessTokenCookie(token);

    const { customerId } = payload;

    if (!customerId) throw createError(404, "Customer is required");
    const reservation = await getReservationByUser({ customerId });
    if (reservation) {
      console.log(reservation);
      return res.status(200).json({
        message: "Your Reservation!",
        reservation: reservation,
      });
    }
  },
});
