import { Playlist } from "../models/playlist-model";
import { User } from "../models/user-model";
import { Song } from "../models/song-model";
import { UserContext } from "../util/auth";

type PlaylistResult = {
  status: number;
  message: string;
};

export const getAllPlaylists = async (user: UserContext | undefined) => {
  return await Playlist.find({ creator: user?._id });
};

export const getPlaylistByID = async (id: string) => {
  const playlist = await Playlist.findById(id);
  if (!playlist) {
    return Promise.reject({ message: "Playlist not found", status: 404 });
  }
  return playlist;
};

export const createPlaylist = async (
  name: string,
  user: UserContext | undefined
) => {
  const creator = user?._id;
  const creatorName = user?.name;
  const username = await User.findById(creator);
  if (!username) {
    return Promise.reject({ message: "User not found", status: 404 });
  }

  const playlist = new Playlist({
    name,
    creator,
    creatorName,
    songs: [],
  });
  const newPlaylist = await playlist.save();

  // add playlist to user
  username.playlists.push(newPlaylist._id);
  await username.save();
  return newPlaylist;
};

export const updatePlaylistByID = async (
  id: string,
  user: UserContext | undefined,
  name: string | undefined,
  songs: Song["_id"] | undefined
): Promise<PlaylistResult | Playlist> => {
  const playlist = await Playlist.findById(id);
  if (!playlist) {
    return Promise.reject({ message: "Playlist not found", status: 404 });
  }

  // check if user is creator
  if (playlist.creator.toString() !== user?._id.toString()) {
    return Promise.reject({ message: "Unauthorized", status: 401 });
  }

  // if we are deleting/adding songs, we need to update the image url
  if (!name && songs) {
    // if there is a first song, get its image url
    if (songs.length > 0) {
      const firstSong = await Song.findOne({ _id: songs[0] });
      if (!firstSong) {
        return Promise.reject({
          message: "Error updating playlist",
          status: 404,
        });
      }
      playlist.imageUrl = firstSong.imageUrl;
    } else {
      // if there are no songs, set the image url to the default
      playlist.imageUrl = "/temp_playlist_icon.png";
    }
  }

  // update playlist
  playlist.name = name || playlist.name;
  playlist.songs = songs || playlist.songs;
  await playlist.save();
  return playlist;
};

export const deletePlaylistByID = async (
  id: string,
  user: UserContext | undefined
) => {
  const playlist = await Playlist.findById(id);
  if (!playlist) {
    return Promise.reject({ message: "Playlist not found", status: 404 });
  }
  if (playlist.creator.toString() !== user?._id.toString()) {
    return Promise.reject({ message: "Unauthorized", status: 401 });
  }
  await playlist.deleteOne();
};
