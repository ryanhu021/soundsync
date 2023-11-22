import express from "express";
import {
  deezerUrlFetch,
  deezerFetch,
  getTrackIdFromDeezerUrl,
} from "../services/deezer-services";
import {
  spotifyUrlFetch,
  spotifyFetch,
  getSongIdFromSpotifyUrl,
} from "../services/spotify-services";
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

//Test if a deezer song has a spotify equivalent in the db
//Input: is a deezer song
//Output: spotify song ID
const testIfSpotified = async (song: Track): Promise<string | null> => {
  let searchedSong;
  if (
    (searchedSong = await Song.findOne({
      name: { $regex: new RegExp(song.name, "i") },
      album: { $regex: new RegExp(song.album, "i") },
      artist: { $regex: new RegExp(song.artist, "i") },
    }))
  ) {
    return getSongIdFromSpotifyUrl(searchedSong.providerUrl);
  } else {
    return await spotifyFetch(song.name, song.album, song.artist);
  }
};

//Test if a spotify song has a deezer equivalent in the db
//Input: is a spotify song
//Output: deezer song ID
const testIfDeezered = async (song: Track): Promise<string | null> => {
  let searchedSong;
  if (
    (searchedSong = await Song.findOne({
      name: { $regex: new RegExp(song.name, "i") },
      album: { $regex: new RegExp(song.album, "i") },
      artist: { $regex: new RegExp(song.artist, "i") },
    }))
  ) {
    return getTrackIdFromDeezerUrl(searchedSong.providerUrl);
  } else {
    return await deezerFetch(song.name, song.album, song.artist);
  }
};

router.post("/url", async (req, res) => {
  if (testIfValidDeezerLink(req.body.url)) {
    deezerUrlFetch(req.body.url)
      .then(async (result) => getSong(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).send({ error }));
  } else if (testIfValidSpotifyLink(req.body.url)) {
    spotifyUrlFetch(req.body.url)
      .then(async (result) => getSong(result))
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).send({ error }));
  } else {
    res.status(400).send({ error: "Invalid URL" });
  }
});

export default router;
