const express = require("express");
const {
  getCharts,
  getChartsAdd,
  postChartsAdd,
  getEditProfile,
  putEditProfile,
  deleteChart,
  getEditChart,
  putEditChart,
} = require("../controllers/profileController.cjs");

const router = express.Router();

router.get("/charts", getCharts);
router.get("/charts/add", getChartsAdd);
router.post("/charts/add", postChartsAdd);
router.get('/edit', getEditProfile);
router.put("/edit", putEditProfile);
router.delete("/charts/:id", deleteChart);

router.get("/charts/edit/:id", getEditChart);
router.put("/charts/edit/:id", putEditChart);

module.exports = router;
