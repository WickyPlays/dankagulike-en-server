import express from "express";
import {
  getCharts,
  getChartsAdd,
  postChartsAdd,
  getEditProfile,
  putEditProfile,
  deleteChart,
  getEditChart,
  putEditChart,
} from "../controllers/profileController";

const router = express.Router();

router.get("/charts", getCharts);
router.get("/charts/add", getChartsAdd);
router.post("/charts/add", postChartsAdd);
router.get('/edit', getEditProfile);
router.put("/edit", putEditProfile);
router.delete("/charts/:id", deleteChart);

router.get("/charts/edit/:id", getEditChart);
router.put("/charts/edit/:id", putEditChart);

export default router;