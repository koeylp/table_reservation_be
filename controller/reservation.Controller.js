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
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjAzNDQzNTA3MDgiLCJlbWFpbCI6IlRoZUtob2kxMjNAZnB0LmVkdS52biIsImN1c3RvbWVySWQiOiI2NDhlZDc0NmY1Y2UxYmYzOGM4YzllMjciLCJmdWxsTmFtZSI6IkzDqiBUaOG6vyBLaMO0aSIsImlhdCI6MTY4NzI4MjI3MX0.q9yR_UGFvIDzENIMq43nK8_9xiT4YHyELZIanoyEIMk";
      // const payload = await verifyAccessTokenCookie(token);
      // console.log(payload);
      // const { customerId } = payload;

      const payload = await verifyAccessTokenCookie(token);
      const { customerId } = payload;
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
