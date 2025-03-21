const {dbPromise} = require("../utils/database.cjs");

exports.getCharts = async (req, res) => {
  const username = req.user ? (req.user).username : null;
  const db = await dbPromise;

  try {
    const charts = await db.all(`
      SELECT * FROM contents
      WHERE googleUserId = ?
    `, [(req.user).id]);

    res.render("profile_charts", { username, charts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch charts.", error });
  }
};

exports.getChartsAdd = (req, res) => {
  const username = req.user ? (req.user).username : null;
  res.render("profile_charts_add", { username });
};

exports.postChartsAdd = async (req, res) => {
  const db = await dbPromise;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    contentType,
    title,
    publisher,
    imageUrl,
    downloadUrl,
    date,
    description,
    songInfo,
  } = req.body;

  const {
    difficulties,
    hasLua,
  } = songInfo;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required." });
  }
  if (!publisher || publisher.trim() === "") {
    return res.status(400).json({ message: "Publisher is required." });
  }

  if (title.length > 250) {
    return res.status(400).json({ message: "Title must be 250 characters or less." });
  }
  if (publisher.length > 250) {
    return res.status(400).json({ message: "Publisher must be 250 characters or less." });
  }

  const currentDate = new Date().toLocaleDateString("en-US");
  const formattedDate = date ? new Date(date).toLocaleDateString("en-US") : currentDate;

  const defaultDifficulties = [0, 0, 0, 0, 0];
  const formattedDifficulties = difficulties || defaultDifficulties;

  try {
    await db.run(`
      INSERT INTO contents (
        googleUserId,
        contentType,
        title,
        publisher,
        imageUrl,
        downloadUrl,
        description,
        date,
        downloadCount,
        voteAverageScore,
        hasLua,
        diff1,
        diff2,
        diff3,
        diff4,
        diff5
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `, [
      user.id,
      contentType,
      title,
      publisher,
      imageUrl,
      downloadUrl,
      description || "",
      formattedDate,
      0, // downloadCount
      0, // voteAverageScore
      hasLua ? 1 : 0, // hasLua
      formattedDifficulties[0], // Easy
      formattedDifficulties[1], // Normal
      formattedDifficulties[2], // Hard
      formattedDifficulties[3], // Extra
      formattedDifficulties[4], // Lunatic
    ]);

    res.status(200).json({ message: "Chart added successfully." });
  } catch (error) {
    console.error("Error adding chart:", error);
    res.status(500).json({ message: "Failed to add chart.", error });
  }
};

exports.getEditChart = async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const chart = await db.get(`
      SELECT * FROM contents
      WHERE id = ? AND googleUserId = ?
    `, [id, user.id]);

    if (!chart) {
      return res.status(404).json({ message: "Chart not found." });
    }

    const googleUser = await db.get("SELECT username FROM googleusers WHERE id = ?", [user.id]);

    //A bit annoying here...
    function formatDateLocal(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    res.render("profile_charts_edit", { chart, username: googleUser ? googleUser.username : null, formatDateLocal });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chart.", error });
  }
};

exports.putEditChart = async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    contentType,
    title,
    publisher,
    imageUrl,
    downloadUrl,
    date,
    description,
    songInfo,
  } = req.body;

  const {
    difficulties,
    hasLua,
  } = songInfo;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required." });
  }
  if (!publisher || publisher.trim() === "") {
    return res.status(400).json({ message: "Publisher is required." });
  }

  if (title.length > 250) {
    return res.status(400).json({ message: "Title must be 250 characters or less." });
  }
  if (publisher.length > 250) {
    return res.status(400).json({ message: "Publisher must be 250 characters or less." });
  }

  const currentDate = new Date().toLocaleDateString("en-US");
  const formattedDate = date ? new Date(date).toLocaleDateString("en-US") : currentDate;

  const defaultDifficulties = [0, 0, 0, 0, 0];
  const formattedDifficulties = difficulties || defaultDifficulties;

  try {
    await db.run(`
      UPDATE contents SET
        contentType = ?,
        title = ?,
        publisher = ?,
        imageUrl = ?,
        downloadUrl = ?,
        description = ?,
        date = ?,
        hasLua = ?,
        diff1 = ?,
        diff2 = ?,
        diff3 = ?,
        diff4 = ?,
        diff5 = ?
      WHERE id = ? AND googleUserId = ?
    `, [
      contentType,
      title,
      publisher,
      imageUrl,
      downloadUrl,
      description || "", // Default to empty string if description is not provided
      formattedDate,
      hasLua ? 1 : 0, // hasLua
      formattedDifficulties[0], // Easy
      formattedDifficulties[1], // Normal
      formattedDifficulties[2], // Hard
      formattedDifficulties[3], // Extra
      formattedDifficulties[4], // Lunatic
      id,
      user.id,
    ]);

    res.status(200).json({ message: "Chart updated successfully." });
  } catch (error) {
    console.error("Error updating chart:", error);
    res.status(500).json({ message: "Failed to update chart.", error });
  }
};

exports.getEditProfile = (req, res) => {
  const username = req.user ? (req.user).username : null;
  res.render('profile_edit', { username });
};

exports.putEditProfile = async (req, res) => {
  const db = await dbPromise;
  const { username } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!username || username.length > 40) {
    return res.status(400).json({ message: "Username must be between 1 and 40 characters." });
  }

  try {
    await db.run("UPDATE googleusers SET username = ? WHERE id = ?", [username, user.id]);
    res.json({ message: "Username changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to change username.", error });
  }
};

exports.deleteChart = async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await db.run(`
      DELETE FROM contents
      WHERE id = ? AND googleUserId = ?
    `, [id, user.id]);

    res.json({ message: "Chart deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete chart.", error });
  }
};