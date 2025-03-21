const { dbPromise } = require("../utils/database.cjs");

exports.updateVoteAverageScore = async (contentId) => {
  const db = await dbPromise;
  const votes = await db.all("SELECT score FROM votes WHERE contentId = ?", [contentId]);
  if (votes.length === 0) return;
  const total = votes.reduce((sum, v) => sum + v.score, 0);
  const averageScore = total / votes.length;
  await db.run("UPDATE contents SET voteAverageScore = ? WHERE id = ?", [averageScore, contentId]);
};
