import express from "express";
import { getContents, getContentById, getContentDescription, incrementDownloadCount, getContentsPage } from "../controllers/contentController";

const router = express.Router();

router.get("/", getContentsPage);
router.get("/contents", getContents);
router.get("/contents/:id", getContentById);
router.get("/contents/:id/description", getContentDescription);
router.put("/contents/:id/downloaded", incrementDownloadCount);

export default router;