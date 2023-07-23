const express = require("express");
const router = express.Router();
const tableController = require("../controller/table.Controller");
const { verifyAccessTokenCookieAdmin } = require("../config/accessToken");
router.post("/add", verifyAccessTokenCookieAdmin, tableController.addTable);
router.post("/edit", verifyAccessTokenCookieAdmin, tableController.updateTable);
router.get("/", verifyAccessTokenCookieAdmin, tableController.getAllTable);
router.get("/search", tableController.searchTable);
router.get("/:tableNumber", tableController.getTableByTableNumber);
router.get(
  "/getWithCapacity/:capacity",
  verifyAccessTokenCookieAdmin,
  tableController.getWithCapacity
);
router.get(
  "/:timeRange",
  verifyAccessTokenCookieAdmin,
  tableController.getTableByTimeRange
);
router.delete(
  "/enableDisableTable/:tableNumber",
  tableController.enableDisableTable
);
router.get(
  "/availableNotAvailable/:tableNumber",
  tableController.availableNotAvailable
);

module.exports = router;
