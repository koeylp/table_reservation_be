const _Table = require("../models/table.Model");
const _User = require("../models/user.Model");
const _Reservation = require("../models/reservation.Model");
const createError = require("http-errors");
const { ObjectId } = require("mongodb");
const { sendMail } = require("../config/sendEmail");

function getCosts(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}

var that = (module.exports = {
  addReservation: async ({
    phone,
    tables,
    arrivalTime,
    fullName,
    phoneReserve,
  }) => {
    return new Promise(async (resolve, reject) => {
      var depositPrice = tables[0].depositAmount.$numberDecimal;
      const tableId = tables[0]._id;
      let arrivalTimeDefault = arrivalTime;
      const customer = await _User.findOne({ phone: phone });
      const dateTime = Date.now();
      const formattedArrivalTime = new Date(dateTime).toLocaleDateString(
        "en-GB"
      );
      const tableAvailable = await _Table.findOne({ _id: tableId });
      if (typeof arrivalTime === "undefined") {
        arrivalTimeDefault = tableAvailable.timeRangeType;
      }
      if (tableAvailable.isAvailable) {
        await _Reservation
          .create({
            customer: customer._id,
            tables: [{ table: tableId }],
            fullName,
            phone: phoneReserve,
            depositAmount: depositPrice,
            arrivalTime: formattedArrivalTime + " " + arrivalTimeDefault,
          })
          .then(async (reservation) => {
            await _Table.findOneAndUpdate(
              { _id: tables[0]._id },
              { $set: { isAvailable: false } }
            );
            const mailOptions = {
              from: '"Reservation SuccessFully!" <yummypotsogood@gmail.com>',
              to: `${customer.email}`,
              subject: "Reservation Table Successfully!",
              html: `<div style="background-color:orange;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
        <div style="width: 50%; background-color: whitesmoke;padding: 10px 30px;">
            <h1 style="text-align: center;">Notification From YummyPot!</h1>
            <h4 style="margin-top:30px; font-weight: 300; ">Thank For Your Reservation </h4>
            <h4 style="margin-top:30px; font-weight: 300; ">Check The Information Below... </h4>
            <h4>Table Number: ${tableAvailable.tableNumber}</h4>
            <h4>Time Range: ${tableAvailable.timeRangeType}</h4>
            <h4>Book Reservation For: ${fullName}</h4>
            <h4>Phone Number: ${phoneReserve}</h4>
            <div style="display: flex;justify-content: center;margin-top:30px">
                <button style="background-color: rgb(255,167,59);border: none;color: whitesmoke;padding: 10px 20px;font-size: 15px;"><a href="http://localhost:5173/profile" >Take A Look Here...</a></button>
            </div>
            <h4 style="margin-top:30px; font-weight: 300;">If does not work, come back to our Website....
            </h4>
            
        </div>
    </div>`,
            };
            sendMail(mailOptions)
              .then((resule) => console.log("Email Send: ", resule))
              .catch((error) => console.log(error));
            resolve(reservation);
          })
          .catch((error) => {
            console.log(error);
            reject(new createError(404, "Cannot Make Reservation"));
          });
      } else {
        reject(new createError(404, "Sorry! Your Table Had Been Booked!"));
      }
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
  getReservationByUser: async ({ phone }) => {
    return new Promise(async (resolve, reject) => {
      const customer = await _User.findOne({ phone: phone });
      await _Reservation
        .find({
          customer: customer._id,
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
        })
        .exec()
        .then((reservation) => {
          resolve(reservation);
        })
        .catch((error) => {
          reject(new createError(404, error));
        });
    });
  },
  cancelReservation: async ({ reservationId, phone }) => {
    return new Promise(async (resolve, reject) => {
      const customer = await _User.findOne({ phone });
      const id = new ObjectId(reservationId);
      await _Reservation
        .findOneAndUpdate(
          { _id: id },
          {
            $set: {
              isCancelled: true,
            },
          },
          { new: true }
        )
        .then(async (reservation) => {
          const tableId = reservation.tables[0].table;
          const table = await _Table.findByIdAndUpdate(
            tableId,
            { $set: { isAvailable: true } },
            { new: true }
          );
          const mailOptions = {
            from: '"Cancel Reservation" <yummypotsogood@gmail.com>',
            to: `yummypotsogood@gmail.com`,
            subject: " Cancel Reservation Table!",
            html: `<div style="background-color:orange;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
        <div style="width: 50%; background-color: whitesmoke;padding: 10px 30px;">
            <h1 style="text-align: center;">Notification From YummyPot!</h1>
            <h4 style="margin-top:30px; font-weight: 300; ">Customer had cancel their table, Check Out the table Below..... </h4>
            <h4>Table Number: ${table.tableNumber}</h4>
            <h4>Time Range: ${table.timeRangeType}</h4>
            <div style="display: flex;justify-content: center;margin-top:30px">
                <button style="background-color: rgb(255,167,59);border: none;color: whitesmoke;padding: 10px 20px;font-size: 15px;"><a href="http://localhost:9000/" >Take A Look Here...</a></button>
            </div>
            <h4 style="margin-top:30px; font-weight: 300;">If does not work, come back to our Website....
            </h4>
            
        </div>
    </div>`,
          };
          sendMail(mailOptions)
            .then((resule) => console.log("Email Send: ", resule))
            .catch((error) => console.log(error));
          resolve(reservation);
        })
        .catch((error) => reject(new createError(404, error)));
    });
  },
  getReservationByTable: async ({ tableNumber, timeRangeType }) => {
    return new Promise(async (resolve, reject) => {
      const table = await _Table.findOne({
        tableNumber,
        isAvailable: false,
        timeRangeType,
      });

      if (!table) {
        reject(
          new createError(404, "Table not found with the given criteria.")
        );
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log(table);
      await _Reservation
        .find({
          "tables.table": table._id,
          createdAt: { $gte: today },
        })
        .select("fullName phone depositAmount arrivalTime isCancelled")
        .then((reservation) => resolve(reservation))
        .catch((error) =>
          reject(new createError(404, "Cannot Find Reservation!"))
        );
    });
  },
});
