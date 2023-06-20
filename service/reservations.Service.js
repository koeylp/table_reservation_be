const _Table = require("../models/table.Model");
const _Reservation = require("../models/reservation.Model");
const createError = require("http-errors");

function getCosts(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}

var that = (module.exports = {
  addReservation: async ({ customerId, tables, arrivalTime }) => {
    return new Promise(async (resolve, reject) => {
      var depositPrice = tables[0].depositAmount.$numberDecimal;
      console.log(tables[0].depositAmount.$numberDecimal);
      // for (let { table } of tables) {
      //   await _Table
      //     .findOne({
      //       _id: table._id,
      //     })
      //     .then((table) => {
      //       console.log(table);
      //     });
      // }
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
