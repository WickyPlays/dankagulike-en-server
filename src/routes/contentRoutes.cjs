const express = require("express");
const { getContents, getContentById, getContentDescription, incrementDownloadCount, getContentsPage } = require("../controllers/contentController.cjs");
const { getVotes, getVotesByContentId, addVote, updateVote } = require("../controllers/voteController.cjs");

const router = express.Router();

router.get("/", getContentsPage);
router.get("/contents", getContents);
router.get("/contents/:id", getContentById);
router.get("/contents/:id/description", getContentDescription);
router.put("/contents/:id/downloaded", incrementDownloadCount);
router.get("/contents/:id/vote", getVotesByContentId);
router.post("/contents/:id/vote", addVote);
router.put("/contents/:id/vote", updateVote);

module.exports = router;
