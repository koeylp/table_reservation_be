const _Table = require("../models/table.Model");
const _Reservation = require("../models/reservation.Model");
const createError = require("http-errors");
var that = (module.exports = {
  addReservation: async ({ customerId, tables, arrivalTime }) => {
    return new Promise(async (resolve, reject) => {
      var depositPrice = 0;
      for (const { table } of tables) {
        await _Table
          .findOne({
            _id: table,
          })
          .then((table) => (depositPrice = depositPrice + +table.depositPrice));
      }
      await _Reservation
        .create({
          customer: customerId,
          tables: tables,
          depositAmount: depositPrice,
          arrivalTime: arrivalTime,
        })
        .then((reservation) => resolve(reservation))
        .catch((error) =>
          reject(new createError(404, "Cannot Make Reservation"))
        );
    });
  },
  getAllReservation: async () => {
    return new Promise(async (resolve, reject) => {
      await _Reservation
        .find()
        .populate("customer", {
          phone: 1,
          fullName: 1,
          _id: 0,
        })
        .populate("tables.table", {
          tableNumber: 1,
          capacity: 1,
          timeRangeType: 1,
          _id: 0,
        })
        .exec()
        .then((reservation) => resolve(reservation))
        .catch((error) => reject(new createError(404, error)));
    });
  },
  getReservationByUser: async ({ customerId }) => {
    return new Promise(async (resolve, reject) => {
      await _Reservation
        .find({
          customer: customerId,
        })
        .populate("customer", {
          phone: 1,
          fullName: 1,
          _id: 0,
        })
        .populate("tables.table", {
          tableNumber: 1,
          capacity: 1,
          timeRangeType: 1,
          _id: 0,
        })
        .exec()
        .then((reservation) => resolve(reservation))
        .catch((error) => reject(new createError(404, error)));
    });
  },
});
