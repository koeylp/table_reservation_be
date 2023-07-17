const express = require("express");
const router = express.Router();
const tableController = require("../controller/table.Controller");

router.post("/add", tableController.addTable);
router.post("/edit", tableController.updateTable);
router.get("/", tableController.getAllTable);
router.get("/search", tableController.searchTable);
router.get("/:tableNumber", tableController.getTableByTableNumber);
router.get("/getWithCapacity/:capacity", tableController.getWithCapacity);
router.get("/:timeRange", tableController.getTableByTimeRange);
router.delete(
  "/enableDisableTable/:tableNumber",
  tableController.enableDisableTable
);
router.get(
  "/availableNotAvailable/:tableNumber",
  tableController.availableNotAvailable
);

module.exports = router;
