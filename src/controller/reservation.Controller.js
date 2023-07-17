const {
  addReservation,
  getAllReservation,
  getReservationByUser,
  cancelReservation,
} = require("../service/reservations.Service");
const createError = require("http-errors");
var that = (module.exports = {
  addReservaion: async (req, res, next) => {
    try {
      const { phone } = req.payload;
      const { tables, arrivalTime } = req.body;
      if (phone && tables && arrivalTime) {
        const reservation = await addReservation({
          phone,
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
    try {
      const { phone } = req.payload;
      if (!phone) throw createError(404, "Customer is required");
      const reservation = await getReservationByUser({ phone });
      if (reservation) {
        return res.status(200).json({
          message: "Your Reservation!",
          reservation: reservation,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  cancelReservation: async (req, res, next) => {
    try {
      const { reservationId } = req.body;
      const { phone } = req.payload;
      if (reservationId) {
        const reservation = await cancelReservation({ reservationId, phone });
        if (reservation) {
          return res.status(200).json({
            message: "Cancel Reservation Process!",
            reservation,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
});
