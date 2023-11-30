import express from "express";
import { spotifyAuthUrl } from "../services/spotify-services";
import { auth } from "../util/auth";

const router = express.Router();

router.get("/spotify", auth, async (req, res) => {
  if (!req.query.state || typeof req.query.state !== "string") {
    res.status(400).send({ error: "Missing state parameter" });
    return;
  }
  res.send({ url: spotifyAuthUrl(req.query.state) });
});
router.get("/deezer", auth, async (req, res) => {
  res.send({ url: "deezer oauth url" });
});
export default router;
