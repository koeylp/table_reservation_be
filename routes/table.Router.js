const express = require("express");
const router = express.Router();
const tableController = require("../controller/table.Controller");

router.post("/add", tableController.addTable);
router.get("/getAll", tableController.getAllTable);
router.get("/search", tableController.searchTable);
router.get("/:tableNumber", tableController.getTableByTableNumber);

module.exports = router;
