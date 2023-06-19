const { time } = require("console");
const { validateTable, validateTableUpdate } = require("../config/validate");
const {
  addTable,
  getAllTable,
  searchTable,
  getTableByTableNumber,
  getTableByTimeRange,
  updateTable,
  enableDisableTable,
  availableNotAvailable,
  getWithCapacity,
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
      const { capacity, timeRangeType } = req.body;
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
  getTableByTimeRange: async (req, res, next) => {
    try {
      const { timeRange } = req.params;
      if (timeRange) {
        const tableList = await getTableByTimeRange({ timeRange });
        if (tableList) {
          return res.status(200).json({
            message: `List Table Of TimeRange: ${timeRange}`,
            tableList: tableList,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  updateTable: async (req, res, next) => {
    const { error } = validateTableUpdate(req.body);
    if (error) throw createError(error.details[0].message);
    const { tableNumber, capacity, depositPrice } = req.body;
    const table = await updateTable({
      tableNumber,
      capacity,
      depositPrice,
    });
    if (table) {
      return res.status(200).json({
        message: "Update Process!",
        table: table,
      });
    }
  },
  enableDisableTable: async (req, res, next) => {
    try {
      const { tableNumber } = req.params;
      if (tableNumber) {
        const updatedTables = await enableDisableTable({ tableNumber });
        if (updatedTables) {
          return res.status(200).json({
            message: "Update Process!",
            data: updatedTables,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  availableNotAvailable: async (req, res, next) => {
    try {
      const { tableNumber } = req.params;
      if (tableNumber) {
        const updateTable = await availableNotAvailable({ tableNumber });
        if (updateTable) {
          return res.status(200).json({
            message: "Update Process!",
            data: updateTable,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  getWithCapacity: async (req, res, next) => {
    try {
      const { capacity } = req.params;
      if (capacity) {
        const distinctCapacities = await getWithCapacity({ capacity });
        if (distinctCapacities) {
          return res.status(200).json({
            list: distinctCapacities,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
});
