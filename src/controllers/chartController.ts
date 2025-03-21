import { Request, Response } from "express";
import { dbPromise } from "../utils/database";

export const getChartDetailPage = async (req: any, res: any) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Chart ID is required." });
  }

  const db = await dbPromise;

  try {
    const chart = await db.get("SELECT * FROM contents WHERE id = ?", [id]);

    if (!chart) {
      return res.status(404).json({ message: "Chart not found." });
    }

    const googleUser = await db.get("SELECT username FROM googleusers WHERE id = ?", [chart.googleUserId]);
    const formattedChart = {
      ...chart,
      date: chart.date.slice(0, 10).replace(/-/g, "/"),
      contentType: [
        "Songs",
        "Note Skins",
        "Sound Effects",
        "GlobalLua",
      ][chart.contentType],
      songInfo: chart.songInfo ? JSON.parse(chart.songInfo) : null,
      googleUsername: googleUser ? googleUser.username : null,
    };

    res.render("charts_detail", {
      chart: formattedChart,
      username: req.user ? (req.user as any).username : null,
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
