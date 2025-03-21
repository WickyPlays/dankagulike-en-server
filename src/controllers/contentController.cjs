const { dbPromise } = require("../utils/database.cjs");
const { transformContent } = require("../services/contentService.cjs");
const { convertLinkToDownloadable } = require("../utils/converter.cjs");

module.exports = {
  createContent: async (req, res) => {
    const db = await dbPromise;
    const { contentType, title, publisher, description, downloadUrl, imageUrl, songInfo } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //@ts-ignore
    const googleUserId = user.id;

    try {
      await db.run(
        "INSERT INTO contents (googleUserId, contentType, title, publisher, description, downloadUrl, imageUrl, songInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [googleUserId, contentType, title, publisher, description, downloadUrl, imageUrl, JSON.stringify(songInfo)]
      );
      res.status(201).json({ message: "Content created successfully." });
    } catch (error) {
      res.status(500).json({ message: "Failed to create content.", error });
    }
  },

  getContentsPage: async (req, res) => {
    const db = await dbPromise;

    const searchBy = req.query.searchBy || "title";
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      let whereClause = "";
      let params = [];

      if (search.trim()) {
        whereClause = `WHERE ${searchBy} LIKE ?`;
        params = [`%${search}%`];
      }

      const totalCountQuery = `SELECT COUNT(*) as totalCount FROM contents ${whereClause}`;
      const totalCountResult = await db.get(totalCountQuery, params);
      const totalCount = totalCountResult.totalCount;

      const contentsQuery = `SELECT * FROM contents ${whereClause} LIMIT ? OFFSET ?`;
      const contents = await db.all(contentsQuery, [...params, limit, offset]);

      const list = contents.map(transformContent);
      const contentsWithFormattedDate = list.map((content) => ({
        ...content,
        date: content.date.slice(0, 10).replace(/-/g, "/"),
      }));

      const totalPages = Math.ceil(totalCount / limit);

      res.render("main", {
        username: req.user ? (req.user).username : null,
        contents: contentsWithFormattedDate,
        totalCount,
        currentPage: page,
        totalPages,
        search,
        searchBy,
      });
    } catch (error) {
      console.error("Database query error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getContents: async (req, res) => {
    const db = await dbPromise;

    const searchBy = req.query.searchBy || "title";
    const search = req.query.search || "";

    try {
      let whereClause = "";
      let params = [];

      if (search.trim()) {
        whereClause = `WHERE ${searchBy} LIKE ?`;
        params = [`%${search}%`];
      }

      const contentsQuery = `SELECT * FROM contents ${whereClause}`;
      const contents = await db.all(contentsQuery, params);

      const list = contents.map(transformContent);
      const contentsWithFormattedDate = list.map((content) => ({
        ...content,
        date: content.date.slice(0, 10).replace(/-/g, "/"),
      }));

      res.status(200).json({ contents: contentsWithFormattedDate });
    } catch (error) {
      console.error("Database query error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getContentById: async (req, res) => {
    const id = req.params.id;
    const db = await dbPromise;
    const content = await db.get("SELECT * FROM contents WHERE id = ?", [id]);
    if (content) {
      content.downloadUrl = convertLinkToDownloadable(content.downloadUrl);
    }
    res.status(200).json({ contents: content });
  },

  getContentDescription: async (req, res) => {
    const id = req.params.id;
    const db = await dbPromise;
    const content = await db.get("SELECT description, downloadUrl, imageUrl FROM contents WHERE id = ?", [id]);
    if (content) {
      content.downloadUrl = convertLinkToDownloadable(content.downloadUrl);
    }
    res.status(200).json(content);
  },

  incrementDownloadCount: async (req, res) => {
    const id = req.params.id;
    const db = await dbPromise;
    try {
      await db.run("UPDATE contents SET downloadCount = downloadCount + 1 WHERE id = ?", [id]);
      res.status(200).send({ message: "Operation was successful." });
    } catch (error) {
      if (error) {
        res.status(500).json({ message: error });
      }
    }
  },
};
