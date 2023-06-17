const { validateTable } = require("../config/validate");
const {
  addTable,
  getAllTable,
  searchTable,
  getTableByTableNumber,
} = require("../service/table.Service");
const createError = require("http-errors");

var that = (module.exports = {
  addTable: async (req, res, next) => {
    try {
      const { error } = validateTable(req.body);
      if (error) throw createError(error.details[0].message);
      const { tableNumber, capacity, depositPrice, timeRangeType } = req.body;
      const table = await addTable({
        tableNumber,
        capacity,
        depositPrice,
        timeRangeType,
      });
      if (table) {
        return res.status(200).json({
          message: "Add Successfully!",
          data: table,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getAllTable: async (req, res, next) => {
    try {
      const listTable = await getAllTable();
      if (listTable) {
        return res.status(200).json({
          listTable: listTable,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  searchTable: async (req, res, next) => {
    try {
      const { capacity, timeRangeType } = req.query;
      const listTableAvailable = await searchTable({ capacity, timeRangeType });
      if (listTableAvailable) {
        return res.status(200).json({
          message: "List Available!",
          listTable: listTableAvailable,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getTableByTableNumber: async (req, res, next) => {
    try {
      const { tableNumber } = req.params;
      const table = await getTableByTableNumber({
        tableNumber,
      });
      if (table) {
        return res.status(200).json({
          message: "Table Available!",
          listTable: table,
        });
      }
    } catch (error) {
      next(error);
    }
  },
});
