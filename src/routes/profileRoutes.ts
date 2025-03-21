import express from "express";
import { dbPromise } from "../utils/database";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get("/charts", (req, res) => {
  const username = req.user ? (req.user as any).username : null;
  res.render("profile_charts", { username });
});

router.get("/charts/add", (req, res) => {
  const username = req.user ? (req.user as any).username : null;
  res.render("profile_charts_add", { username });
});

router.get('/edit', authMiddleware, (req, res) => {
  const username = req.user ? (req.user as any).username : null;
  res.render('profile_edit', { username });
})

router.put("/edit", async (req: any, res: any) => {
  const db = await dbPromise
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
});

export default router;
