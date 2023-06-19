const {
  addReservation,
  getAllReservation,
} = require("../service/reservations.Service");
var that = (module.exports = {
  addReservaion: async (req, res, next) => {
    try {
      console.log("Herre");
      const { customerId } = req.payload;
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
});
