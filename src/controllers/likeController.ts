import { Request, Response } from "express";
import { dbPromise } from "../utils/database";

export const getLikesByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const db = await dbPromise;
  const likes = await db.all("SELECT * FROM likes WHERE userId = ?", [userId]);
  res.status(200).json({ likes });
};

export const addLike = async (req: Request, res: Response) => {
  const voteId = req.body.voteId;
  const userId = req.params.userId;
  const db = await dbPromise;
  try {
    await db.run("INSERT INTO likes (userId, voteId) VALUES (?, ?)", [userId, voteId]);
    await db.run("UPDATE votes SET like = like + 1 WHERE id = ?", [voteId]);
    res.status(200).send({ message: "Operation was successful." });
  } catch (error) {
    if (error) {
      res.status(500).json({ message: error });
    }
  }
};