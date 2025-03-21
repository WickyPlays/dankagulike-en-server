const express = require("express");
const { getChartDetailPage } = require("../controllers/chartController.cjs");

const router = express.Router();

router.get("/:id", getChartDetailPage);

module.exports = router;
