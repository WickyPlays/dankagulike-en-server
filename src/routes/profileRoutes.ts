import express from "express";
import {
  getCharts,
  getChartsAdd,
  getEditProfile,
  putEditProfile,
  deleteChart,
} from "../controllers/profileController";

const router = express.Router();

router.get("/charts", getCharts);
router.get("/charts/add", getChartsAdd);
router.get('/edit', getEditProfile);
router.put("/edit", putEditProfile);
router.delete("/charts/:id", deleteChart);

export default router;