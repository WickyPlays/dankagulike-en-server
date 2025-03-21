import { Request, Response } from "express";
import { dbPromise } from "../utils/database";

export const getCharts = async (req: Request, res: Response) => {
  const username = req.user ? (req.user as any).username : null;
  const db = await dbPromise;

  try {
    const charts = await db.all(`
      SELECT * FROM contents
      WHERE googleUserId = ?
    `, [(req.user as any).id]);

    res.render("profile_charts", { username, charts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch charts.", error });
  }
};

export const getChartsAdd = (req: Request, res: Response) => {
  const username = req.user ? (req.user as any).username : null;
  res.render("profile_charts_add", { username });
};

export const getEditProfile = (req: Request, res: Response) => {
  const username = req.user ? (req.user as any).username : null;
  res.render('profile_edit', { username });
};

export const putEditProfile = async (req: any, res: any) => {
  const db = await dbPromise;
  const { username } = req.body;
  const user = req.user as any;

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

export const deleteChart = async (req: any, res: any) => {
  const db = await dbPromise;
  const { id } = req.params;
  const user = req.user as any;

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