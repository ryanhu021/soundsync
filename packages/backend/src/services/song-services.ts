import { Song } from "../models/song-model";
import { Playlist } from "../models/playlist-model";
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

export const getSongs = async (id: string) => {
  const playlist = await Playlist.findById(id);
  if (!playlist) {
    return Promise.reject({ message: "Playlist not found", status: 404 });
  }
  const songs = await Song.aggregate([
    {
      $match: {
        _id: { $in: playlist.songs },
      },
    },
    {
      $addFields: {
        __order: {
          $indexOfArray: [playlist.songs, "$_id"],
        },
      },
    },
    {
      $sort: {
        __order: 1,
      },
    },
  ]);
  if (!songs) {
    return Promise.reject({ message: "Songs not found", status: 404 });
  }
  return songs;
};
