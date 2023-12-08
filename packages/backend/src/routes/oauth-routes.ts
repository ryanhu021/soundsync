import express from "express";
import { spotifyAuthUrl } from "../services/spotify-services";
import { auth } from "../util/auth";
import { deezerAuthUrl } from "../services/deezer-services";
import { getAccessToken } from "../services/deezer-services";

const router = express.Router();

router.get("/spotify", auth, async (req, res) => {
  if (
    !req.query.state ||
    typeof req.query.state !== "string" ||
    !req.query.type ||
    typeof req.query.type !== "string"
  ) {
    res.status(400).send({ error: "Missing state or type parameter" });
    return;
  }
  res.send({ url: spotifyAuthUrl(req.query.state, req.query.type) });
});

router.get("/deezer", auth, async (req, res) => {
  if (
    !req.query.state ||
    typeof req.query.state !== "string" ||
    !req.query.type ||
    typeof req.query.type !== "string"
  ) {
    res.status(400).send({ error: "Missing state or type Parameter" });
    return;
  }
  res.send({ url: deezerAuthUrl(req.query.state, req.query.type) });
});

router.get("/deezer/token", async (req, res) => {
  if (!req.query.code || typeof req.query.code !== "string") {
    res.status(400).send({ error: "Missing Code Parameter" });
    return;
  }
  try {
    const token = await getAccessToken(req.query.code);
    res.status(200).send({ token: token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error getting access token" });
  }
});

export default router;
