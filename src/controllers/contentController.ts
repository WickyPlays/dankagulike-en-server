import { Request, Response } from "express";
import { dbPromise } from "../utils/database";
import { transformContent } from "../services/contentService";
import { convertLinkToDownloadable } from "../utils/converter";

export const createContent = async (req: Request, res: Response) => {
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
};

export const getContentsPage = async (req: Request, res: Response) => {
  const db = await dbPromise;

  const searchBy = req.query.searchBy as string || "title";
  const search = req.query.search as string || "";
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    let whereClause = "";
    let params: (string | number)[] = [];

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
      username: req.user ? (req.user as any).username : null,
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
};

export const getContents = async (req: Request, res: Response) => {
  const db = await dbPromise;

  const searchBy = req.query.searchBy as string || "title";
  const search = req.query.search as string || "";

  try {
    let whereClause = "";
    let params: (string | number)[] = [];

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
};

export const getContentById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const db = await dbPromise;
  const content = await db.get("SELECT * FROM contents WHERE id = ?", [id]);
  if (content) {
    content.downloadUrl = convertLinkToDownloadable(content.downloadUrl);
  }
  res.status(200).json({ contents: content });
};

export const getContentDescription = async (req: Request, res: Response) => {
  const id = req.params.id;
  const db = await dbPromise;
  const content = await db.get("SELECT description, downloadUrl, imageUrl FROM contents WHERE id = ?", [id]);
  if (content) {
    content.downloadUrl = convertLinkToDownloadable(content.downloadUrl);
  }
  res.status(200).json(content);
};

export const incrementDownloadCount = async (req: Request, res: Response) => {
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
};