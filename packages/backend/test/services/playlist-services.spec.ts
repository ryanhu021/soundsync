import {
  createPlaylist,
  getPlaylistByID,
  getAllPlaylists,
  updatePlaylistByID,
  deletePlaylistByID,
} from "../../src/services/playlist-services";
import { Playlist } from "../../src/models/playlist-model";
import { Song } from "../../src/models/song-model";
import { User } from "../../src/models/user-model";

jest.mock("../../src/models/user-model");
jest.mock("../../src/models/playlist-model");
jest.mock("../../src/models/song-model");

const MOCK_PLAYLIST_ID = "playlist123";
const MOCK_USER = {
  _id: "user123",
  name: "John Doe",
  email: "johndoe@example.com",
  playlists: [],
  save: jest.fn(),
};
const MOCK_NAME = "Old Playlist Name";
const MOCK_SONGS = ["song123", "song456"];
const MOCK_IMAGE_URL = "songImageUrl";
const MOCK_PLAYLIST = {
  _id: MOCK_PLAYLIST_ID,
  creator: MOCK_USER._id,
  name: MOCK_NAME,
  songs: MOCK_SONGS,
  imageUrl: MOCK_IMAGE_URL,
  save: jest.fn(),
  deleteOne: jest.fn(),
};

describe("Playlist Services", () => {
  beforeEach(() => {
    User.prototype.save = jest.fn().mockResolvedValue({ ...MOCK_USER });
    MOCK_USER.save = jest.fn().mockResolvedValue({ ...MOCK_USER });
    User.findById = jest.fn().mockResolvedValue({ ...MOCK_USER });
    Playlist.prototype.save = jest.fn().mockResolvedValue({ ...MOCK_PLAYLIST });
    MOCK_PLAYLIST.save = jest.fn().mockResolvedValue({ ...MOCK_PLAYLIST });
    MOCK_PLAYLIST.deleteOne = jest.fn().mockResolvedValue(undefined);
    Playlist.findById = jest.fn().mockResolvedValue({ ...MOCK_PLAYLIST });
    Playlist.find = jest.fn().mockResolvedValue([MOCK_PLAYLIST]);
    Song.findOne = jest.fn().mockResolvedValue({ imageUrl: MOCK_IMAGE_URL });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllPlaylists", () => {
    it("should return all playlists if the user is logged in", async () => {
      const result = await getAllPlaylists(MOCK_USER);

      expect(Playlist.find).toHaveBeenCalledWith({ creator: MOCK_USER._id });
      expect(result).toEqual([MOCK_PLAYLIST]);
    });

    it("should return an empty array if the user is not logged in", async () => {
      Playlist.find = jest.fn().mockResolvedValue([]);
      const result = await getAllPlaylists(undefined);

      expect(Playlist.find).toHaveBeenCalledWith({ creator: undefined });
      expect(result).toEqual([]);
    });
  });

  describe("getPlaylistByID", () => {
    it("should return the playlist with the given ID", async () => {
      const result = await getPlaylistByID(MOCK_PLAYLIST_ID);

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
      expect(result).toEqual(MOCK_PLAYLIST);
    });

    it("should return an error if the playlist is not found", async () => {
      Playlist.findById = jest.fn().mockResolvedValue(null);

      await expect(getPlaylistByID(MOCK_PLAYLIST_ID)).rejects.toEqual({
        message: "Playlist not found",
        status: 404,
      });

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
    });
  });

  describe("createPlaylist", () => {
    it("should create a new playlist and add it to the user's playlists", async () => {
      const result = await createPlaylist(MOCK_NAME, MOCK_USER);

      expect(Playlist.prototype.save).toHaveBeenCalledTimes(1);
      expect(User.findById).toHaveBeenCalledWith(MOCK_USER._id);
      expect(MOCK_USER.save).toHaveBeenCalledTimes(1);
      expect(result._id.toString()).toEqual(MOCK_PLAYLIST_ID);
    });

    it("should return an error if the user is not found", async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      await expect(createPlaylist(MOCK_NAME, MOCK_USER)).rejects.toEqual({
        message: "User not found",
        status: 404,
      });

      expect(Playlist).not.toHaveBeenCalled();
      expect(User.findById).toHaveBeenCalledWith(MOCK_USER._id);
    });

    it("should return an error if the user is undefined", async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      await expect(createPlaylist(MOCK_NAME, undefined)).rejects.toEqual({
        message: "User not found",
        status: 404,
      });

      expect(Playlist).not.toHaveBeenCalled();
      expect(User.findById).not.toHaveBeenCalled();
    });
  });

  describe("updatePlaylistByID", () => {
    it("should update the playlist name", async () => {
      const newPlaylist = {
        ...MOCK_PLAYLIST,
        name: "New Playlist Name",
        songs: MOCK_SONGS,
      };

      const result = await updatePlaylistByID(
        MOCK_PLAYLIST_ID,
        MOCK_USER,
        "New Playlist Name",
        undefined
      );

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
      expect(MOCK_PLAYLIST.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(newPlaylist);
    });

    it("should update the playlist songs", async () => {
      const newPlaylist = {
        ...MOCK_PLAYLIST,
        name: MOCK_NAME,
        songs: [...MOCK_SONGS, "newSong123"],
      };

      const result = await updatePlaylistByID(
        MOCK_PLAYLIST_ID,
        MOCK_USER,
        undefined,
        [...MOCK_SONGS, "newSong123"]
      );

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
      expect(MOCK_PLAYLIST.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(newPlaylist);
    });

    it("should update the playlist image URL to the first song's image URL", async () => {
      Song.findOne = jest.fn().mockResolvedValue({ imageUrl: "newImageUrl" });

      const newPlaylist = {
        ...MOCK_PLAYLIST,
        imageUrl: "newImageUrl",
      };

      const result = await updatePlaylistByID(
        MOCK_PLAYLIST_ID,
        MOCK_USER,
        undefined,
        MOCK_SONGS
      );

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
      expect(MOCK_PLAYLIST.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(newPlaylist);
    });

    it("should return an error if the playlist is not found", async () => {
      Playlist.findById = jest.fn().mockResolvedValue(null);

      await expect(
        updatePlaylistByID(MOCK_PLAYLIST_ID, MOCK_USER, undefined, undefined)
      ).rejects.toEqual({ message: "Playlist not found", status: 404 });

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
    });

    it("should return an error if the user is not the creator of the playlist", async () => {
      const otherContext = { ...MOCK_USER, _id: "otherUser123" };
      await expect(
        updatePlaylistByID(MOCK_PLAYLIST_ID, otherContext, undefined, undefined)
      ).rejects.toEqual({ message: "Unauthorized", status: 401 });

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
    });

    it("should update the playlist image URL to the default if there are no songs", async () => {
      const emptyPlaylist = {
        ...MOCK_PLAYLIST,
        songs: [],
        imageUrl: "/temp_playlist_icon.png",
      };

      const result = await updatePlaylistByID(
        MOCK_PLAYLIST_ID,
        MOCK_USER,
        undefined,
        []
      );

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
      expect(MOCK_PLAYLIST.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(emptyPlaylist);
    });

    it("should return an error if the first song is not found", async () => {
      Song.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        updatePlaylistByID(MOCK_PLAYLIST_ID, MOCK_USER, undefined, [
          "invalidSong123",
        ])
      ).rejects.toEqual({ message: "Error updating playlist", status: 404 });

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
      expect(Song.findOne).toHaveBeenCalledWith({ _id: "invalidSong123" });
    });

    it("should return an error if the user is undefined", async () => {
      await expect(
        updatePlaylistByID(MOCK_PLAYLIST_ID, undefined, undefined, undefined)
      ).rejects.toEqual({ message: "User not found", status: 404 });

      expect(Song.findOne).not.toHaveBeenCalled();
    });
  });

  describe("deletePlaylistByID", () => {
    it("should delete the playlist if the user is the creator", async () => {
      const result = await deletePlaylistByID(MOCK_PLAYLIST_ID, MOCK_USER);

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
      expect(MOCK_PLAYLIST.deleteOne).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it("should return an error if the playlist is not found", async () => {
      Playlist.findById = jest.fn().mockResolvedValue(null);

      await expect(
        deletePlaylistByID(MOCK_PLAYLIST_ID, MOCK_USER)
      ).rejects.toEqual({ message: "Playlist not found", status: 404 });

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
      expect(MOCK_PLAYLIST.deleteOne).not.toHaveBeenCalled();
    });

    it("should return an error if the user is not the creator of the playlist", async () => {
      const otherContext = { ...MOCK_USER, _id: "otherUser123" };
      await expect(
        deletePlaylistByID(MOCK_PLAYLIST_ID, otherContext)
      ).rejects.toEqual({ message: "Unauthorized", status: 401 });

      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST_ID);
      expect(MOCK_PLAYLIST.deleteOne).not.toHaveBeenCalled();
    });

    it("should return an error if the user is undefined", async () => {
      await expect(
        deletePlaylistByID(MOCK_PLAYLIST_ID, undefined)
      ).rejects.toEqual({ message: "User not found", status: 404 });

      expect(MOCK_PLAYLIST.deleteOne).not.toHaveBeenCalled();
    });
  });
});
