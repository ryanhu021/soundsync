import express from "express";
import { deezerUrlSearch } from "../services/deezer-services";
import { spotifySongFetch } from "../services/spotify-services";
import {
  getSongByID,
  getSong,
  testIfValidDeezerLink,
  testIfValidSpotifyLink,
} from "../services/song-services";

const router = express.Router();

router.get("/:id", async (req, res) => {
  getSongByID(req.params.id)
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(error.status).send(error.message));
});

router.post("/url", async (req, res) => {
  if (testIfValidDeezerLink(req.body.url)) {
    deezerUrlSearch(req.body.url)
      .then(async (result) => getSong(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).send({ error }));
  } else if (testIfValidSpotifyLink(req.body.url)) {
    spotifySongFetch(req.body.url)
      .then(async (result) => getSong(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).send({ error }));
  } else {
    res.status(400).send({ error: "Invalid URL" });
  }
});

export default router;
