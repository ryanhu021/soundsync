import { Song } from "../models/song-model";
import { Track } from "../services/spotify-services";

export const testIfValidDeezerLink = (url: string): boolean => {
  const pattern = new RegExp("deezer.page.link");
  return pattern.test(url);
};
export const testIfValidSpotifyLink = (url: string): boolean => {
  const pattern = new RegExp("open.spotify.com/track/");
  return pattern.test(url);
};

export const getSong = async (result: Track): Promise<Song> => {
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

export const getSongByID = async (id: string) => {
  const song = await Song.findById(id);
  if (!song) {
    return Promise.reject({ message: "Song not found", status: 404 });
  }
  return song;
};
