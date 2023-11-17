import express from "express";
import { deezerUrlSearch } from "../services/deezer-services";
import { spotifySongFetch } from "../services/spotify-services";

const router = express.Router();

const testIfValidDeezerLink = (url: string): boolean => {
  const pattern = new RegExp("deezer.page.link");
  return pattern.test(url);
};
const testIfValidSpotifyLink = (url: string): boolean => {
  const pattern = new RegExp("open.spotify.com/track/");
  return pattern.test(url);
};

router.post("/url", async (req, res) => {
  if (testIfValidDeezerLink(req.body.url)) {
    deezerUrlSearch(req.body.url)
      .then((result) => res.status(200).send(result))
      .catch((error) => res.status(500).send({ error }));
  } else if (testIfValidSpotifyLink(req.body.url)) {
    spotifySongFetch(req.body.url)
      .then((result) => res.status(200).send(result))
      .catch((error) => res.status(500).send({ error }));
  } else {
    res.status(400).send({ error: "Invalid URL" });
  }
});

export default router;
