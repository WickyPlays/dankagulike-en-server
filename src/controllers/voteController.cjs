const { dbPromise } = require("../utils/database.cjs");
const { updateVoteAverageScore } = require("../services/voteService.cjs");

exports.getVotes = async (req, res) => {
  const db = await dbPromise;
  const votes = await db.all("SELECT * FROM votes");
  res.status(200).json({ votes });
};

exports.getVotesByContentId = async (req, res) => {
  const id = req.params.id;
  const db = await dbPromise;
  const votes = await db.all("SELECT * FROM votes WHERE contentId = ?", [id]);
  res.status(200).json({ votes });
};

exports.addVote = async (req, res) => {
  const contentId = req.params.id;
  const db = await dbPromise;
  try {
    await db.run("INSERT INTO votes (contentId, userId, name, score, comment, like, date) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      contentId,
      req.body.userId,
      req.body.name,
      req.body.score,
      req.body.comment,
      req.body.like || 0,
      req.body.date
    ]);
    res.status(200).send({ message: "Operation was successful." });
    updateVoteAverageScore(contentId);
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error });
    }
  }
};

exports.updateVote = async (req, res) => {
  const contentId = req.params.id;
  const voteId = req.body.id;
  const db = await dbPromise;
  try {
    await db.run("UPDATE votes SET name = ?, score = ?, comment = ?, like = 0, date = ? WHERE id = ? AND userId = ?", [
      req.body.name,
      req.body.score,
      req.body.comment,
      req.body.date,
      voteId,
      req.body.userId
    ]);
    await db.run("DELETE FROM likes WHERE voteId = ?", [voteId]);
    res.status(200).send({ message: "Operation was successful." });
    updateVoteAverageScore(contentId);
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error });
    }
  }
};
