const {
  addReservation,
  getAllReservation,
  getReservationByUser,
} = require("../service/reservations.Service");
const createError = require("http-errors");
var that = (module.exports = {
  addReservaion: async (req, res, next) => {
    try {
      const { customerId } = req.payload;
      const { tables, arrivalTime } = req.body;
      if (customerId && tables && arrivalTime) {
        console.log(tables);
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
    const { customerId } = req.payload;
    if (!customerId) throw createError(404, "Customer is required");
    const reservation = await getReservationByUser({ customerId });
    if (reservation) {
      return res.status(200).json({
        message: "Your Reservation!",
        reservation: reservation,
      });
    }
  },
});
