const express = require("express");
const { getLikesByUserId, addLike } = require("../controllers/likeController.cjs");

const router = express.Router();

router.get("/likes/:userId", getLikesByUserId);
router.put("/likes/:userId", addLike);

module.exports = router;
