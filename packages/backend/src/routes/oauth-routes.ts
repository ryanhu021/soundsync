import express from "express";
import { spotifyAuthUrl } from "../services/spotify-services";
import { auth } from "../util/auth";

const router = express.Router();

router.get("/spotify", auth, async (req, res) => {
  res.send({ url: spotifyAuthUrl() });
});
router.get("/deezer", auth, async (req, res) => {
  res.send({ url: "deezer oauth url" });
});
export default router;
