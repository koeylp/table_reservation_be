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
  getTableByTimeRange: async ({ timeRange }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .find({
          timeRangeType: timeRange,
        })
        .then((tableList) => resolve(tableList))
        .catch((error) =>
          reject(
            new createError(
              404,
              `Cannot Find Table Available With TimeRange: ${timeRange}!`
            )
          )
        );
    });
  },
  updateTable: async ({ tableNumber, capacity, depositPrice }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .updateMany(
          {
            tableNumber: tableNumber,
          },
          {
            $set: {
              capacity: capacity,
              depositPrice: depositPrice,
            },
          }
        )
        .then((table) => resolve(table))
        .catch((error) =>
          reject(
            new createError(
              404,
              `Cannot Update Table With TableNumber: ${tableNumber}!`
            )
          )
        );
    });
  },
  enableDisableTable: async ({ tableNumber }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .findOne({
          tableNumber: tableNumber,
        })
        .then(async (table) => {
          if (table.status === 1) {
            await _Table
              .updateMany(
                {
                  tableNumber: tableNumber,
                },
                {
                  $set: { status: 0 },
                }
              )
              .then((updateTable) => resolve(updateTable));
          } else {
            await _Table
              .updateMany(
                {
                  tableNumber: tableNumber,
                },
                {
                  $set: { status: 1 },
                }
              )
              .then((updateTable) => resolve(updateTable));
          }
        })
        .catch((error) => {
          reject(
            new createError(
              404,
              `Cannot Update Table With TableNumber: ${tableNumber}!`
            )
          );
        });
    });
  },
  availableNotAvailable: async ({ tableNumber }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .findOne({
          tableNumber: tableNumber,
        })
        .then(async (table) => {
          if (table.isAvailable === true) {
            await _Table
              .updateMany(
                {
                  tableNumber: tableNumber,
                },
                {
                  $set: { isAvailable: false },
                }
              )
              .then((updateTable) => resolve(updateTable));
          } else {
            await _Table
              .updateMany(
                {
                  tableNumber: tableNumber,
                },
                {
                  $set: { isAvailable: true },
                }
              )
              .then((updateTable) => resolve(updateTable));
          }
        })
        .catch((error) => {
          reject(
            new createError(
              404,
              `Cannot Update Table With TableNumber: ${tableNumber}!`
            )
          );
        });
    });
  },
});
