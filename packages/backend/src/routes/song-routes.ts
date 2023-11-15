import express from "express";
import { deezerUrlSearch } from "../services/deezer-services";

const router = express.Router();

router.get("/url", async (req, res) => {
  const query = req.query.id as string;

  try {
    const track = await deezerUrlSearch(query);
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
