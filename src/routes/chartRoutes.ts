import express from "express";
import { getChartDetailPage } from "../controllers/chartController";

const router = express.Router();

router.get("/:id", getChartDetailPage);

export default router;