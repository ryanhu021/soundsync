import express from "express";
import { deezerUrlSearch } from "../services/deezer-services";
import { spotifySongFetch } from "../services/spotify-services";
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
    const { name, artist, album, providerUrl } = result;
    song = new Song({ name, artist, album, providerUrl });
    const newSong = await song.save();
    return newSong;
  }
};

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
