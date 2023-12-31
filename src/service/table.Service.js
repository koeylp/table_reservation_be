const _Table = require("../models/table.Model");
const createError = require("http-errors");
const cron = require("node-cron");

cron.schedule("31 19 * * *", async () => {
  try {
    const tables = await _Table.find();
    tables.forEach(async (table) => {
      table.isAvailable = true;
      await table.save();
    });
    console.log("isAvailable field updated successfully.");
  } catch (error) {
    console.error("Error updating isAvailable field:", error);
  }
});

var that = (module.exports = {
  addTable: async ({ tableNumber, capacity, depositPrice }) => {
    return new Promise(async (resolve, reject) => {
      const listNumberTable = await _Table.find({}).distinct("tableNumber");
      const isTableExist = listNumberTable.includes(tableNumber);
      if (!isTableExist) {
        const tableData = [
          {
            tableNumber: tableNumber,
            capacity: capacity,
            depositPrice: depositPrice,
            timeRangeType: "12h",
          },
          {
            tableNumber: tableNumber,
            capacity: capacity,
            depositPrice: depositPrice,
            timeRangeType: "14h",
          },
          {
            tableNumber: tableNumber,
            capacity: capacity,
            depositPrice: depositPrice,
            timeRangeType: "16h",
          },
        ];
        await _Table
          .create(tableData)
          .then((table) => resolve(table))
          .catch((error) => reject(new createError(404, "Cannot Add Table!")));
      } else {
        reject(new createError(404, "Table Number Is Already Exist!"));
      }
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
  searchTable: async ({ capacity, timeRangeType }) => {
    return new Promise(async (resolve, reject) => {
      const checkTimeRangeType =
        new Date().setHours(Number(16)) - Date.now() < 14 * 60 * 1000;
      if (checkTimeRangeType) {
        reject(new createError(404, "Cannot Find Table Out Of Time!"));
      }
      const query = {
        isAvailable: true,
        status: 1,
      };
      if (typeof timeRangeType === "undefined") {
        reject(new createError(404, "Cannot Find Table With Empty Time..."));
      }
      if (typeof capacity !== "undefined") {
        query.capacity = capacity;
      }
      if (typeof timeRangeType !== "undefined") {
        query.timeRangeType = timeRangeType;
      }
      await _Table
        .find(query)
        .then((listTableAvailable) => resolve(listTableAvailable))
        .catch((error) =>
          reject(new createError(404, "Cannot Find Table Available"))
        );
    });
  },
  getTableByTableNumber: async ({ tableNumber }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .find(
          {
            tableNumber: tableNumber,
          },
          {
            tableNumber: 1,
            capacity: 1,
            depositPrice: 1,
            timeRangeType: 1,
            isAvailable: 1,
            _id: 0,
          }
        )
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
      const tables = await _Table.find({ tableNumber });
      if (tables.length > 0) {
        const isAnyTableAvailable = tables.some(
          (table) => table.isAvailable == false
        );
        if (!isAnyTableAvailable) {
          const newStatus = tables[0].status === 1 ? 0 : 1;
          const updatedTables = await _Table.updateMany(
            { tableNumber },
            { $set: { status: newStatus } }
          );
          resolve(updatedTables);
        } else {
          const tables = await _Table.findOne({
            tableNumber,
            isAvailable: false,
          });
          reject(
            new createError(
              404,
              `Cannot Delete, Table is booking at ${tables.timeRangeType}!`
            )
          );
        }
      } else {
        reject(
          new new createError(
            404,
            `No tables with TableNumber: ${tableNumber} found!`
          )()
        );
      }
    });
  },
  availableNotAvailable: async ({ tableNumber }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .findOne({
          tableNumber: tableNumber,
        })
        .then(async (table) => {
          const newAvailability = !table.isAvailable;
          const updatedTables = await _Table.updateMany(
            { tableNumber },
            { $set: { isAvailable: newAvailability } }
          );
          resolve(updatedTables);
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
  getWithCapacity: async ({ capacity }) => {
    return new Promise(async (resolve, reject) => {
      await _Table
        .find({
          capacity: capacity,
        })
        .distinct("tableNumber")
        .then(async (distinctTableNumbers) => {
          const distinctCapacities = await Promise.all(
            distinctTableNumbers.map(async (tableNumber) => {
              const table = await _Table.findOne(
                { tableNumber },
                { tableNumber: 1, capacity: 1, _id: 0, status: 1 }
              );
              return table;
            })
          );
          resolve(distinctCapacities);
        })
        .catch((error) => reject(error));
    });
  },
});
