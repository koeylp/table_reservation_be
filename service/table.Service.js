const _Table = require("../models/table.Model");
const createError = require("http-errors");
var that = (module.exports = {
  addTable: async ({ tableNumber, capacity, depositPrice, timeRangeType }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .create({
          tableNumber,
          capacity,
          depositPrice,
          timeRangeType,
        })
        .then((table) => resolve(table))
        .catch((error) => reject(new createError(404, "Cannot Add Table!")));
    });
  },
  getAllTable: () => {
    return new Promise((resolve, reject) => {
      _Table
        .find()
        .then((listTable) => resolve(listTable))
        .catch((error) => reject(new createError(404, "Empty List!")));
    });
  },
  searchTable: async ({ capacity = 4, timeRangeType = "6h" }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .find({
          capacity,
          timeRangeType,
        })
        .then((listTableAvailable) => resolve(listTableAvailable))
        .catch((error) =>
          reject(new createError(404, "Cannot Find Table Available!"))
        );
    });
  },
  getTableByTableNumber: async ({ tableNumber }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .find({
          tableNumber: tableNumber,
        })
        .then((table) => resolve(table))
        .catch((error) =>
          reject(new createError(404, "Cannot Find Table Available!"))
        );
    });
  },
});
