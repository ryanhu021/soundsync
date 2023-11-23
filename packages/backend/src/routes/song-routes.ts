import express from "express";
import { deezerUrlSearch } from "../services/deezer-services";
import { spotifyAuthUrl, spotifySongFetch } from "../services/spotify-services";
import { Song } from "../models/song-model";
import { Track } from "../services/spotify-services";

const router = express.Router();

const testIfValidDeezerLink = (url: string): boolean => {
  const pattern = new RegExp("deezer.page.link");
  return pattern.test(url);
};
const testIfValidSpotifyLink = (url: string): boolean => {
  const pattern = new RegExp("open.spotify.com/track/");
  return pattern.test(url);
};

const getSong = async (result: Track): Promise<Song> => {
  let song;
  if ((song = await Song.findOne({ providerUrl: result.providerUrl }))) {
    return song;
  } else {
    const { name, artist, album, providerUrl, imageUrl } = result;
    song = new Song({ name, artist, album, providerUrl, imageUrl });
    const newSong = await song.save();
    return newSong;
  }
};

router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).send({ error: "Song not found" });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).send({ error });
  }
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

router.get("/auth/spotify", async (req, res) => {
  res.send({ url: spotifyAuthUrl() });
});

export default router;
