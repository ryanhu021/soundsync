import express from "express";
import { spotifyAuthUrl } from "../services/spotify-services";
import { auth } from "../util/auth";
import { deezerAuthUrl } from "../services/deezer-services";

const router = express.Router();

router.get("/spotify", auth, async (req, res) => {
  if (!req.query.playlistId || typeof req.query.playlistId !== "string") {
    res.status(400).send({ error: "Missing state parameter" });
    return;
  }
  res.send({ url: spotifyAuthUrl(req.query.playlistId) });
});
router.get("/deezer", auth, async (req, res) => {
  if (!req.query.playlistId || typeof req.query.playlistId !== "string") {
    res.status(400);
    res.send({ error: "Missing State Parameter" });
    return;
  }
  res.send({ url: deezerAuthUrl(req.query.playlistId) });
});
export default router;
