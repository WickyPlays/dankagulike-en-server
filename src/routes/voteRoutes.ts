import express from "express";
import { getVotes, getVotesByContentId, addVote, updateVote } from "../controllers/voteController";

const router = express.Router();

router.get("/votes", getVotes);
router.get("/contents/:id/vote", getVotesByContentId);
router.post("/contents/:id/vote", addVote);
router.put("/contents/:id/vote", updateVote);

export default router;