import express from "express";
import { getLikesByUserId, addLike } from "../controllers/likeController";

const router = express.Router();

router.get("/likes/:userId", getLikesByUserId);
router.put("/likes/:userId", addLike);

export default router;