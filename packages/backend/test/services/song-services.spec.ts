import {
  testIfValidDeezerLink,
  testIfValidSpotifyLink,
  getSong,
  getSongs,
} from "../../src/services/song-services";
import { Song } from "../../src/models/song-model";
import { Playlist } from "../../src/models/playlist-model";

jest.mock("../../src/models/song-model");
jest.mock("../../src/models/playlist-model");

export const MOCK_SONG = {
  _id: "song123",
  name: "Song Name",
  artist: "Artist Name",
  album: "Album Name",
  providerUrl: "https://example.com/song",
  imageUrl: "https://example.com/song/image.jpg",
};

const MOCK_PLAYLIST = {
  _id: "playlist123",
  name: "Playlist Name",
  creator: "user123",
  songs: ["song123"],
  imageUrl: "https://example.com/playlist/image.jpg",
  save: jest.fn(),
  deleteOne: jest.fn(),
};

describe("Song Services", () => {
  describe("testIfValidDeezerLink", () => {
    it("should return true if the link is valid", () => {
      const result = testIfValidDeezerLink("https://deezer.page.link/123");

      expect(result).toBe(true);
    });

    it("should return false if the link is invalid", () => {
      const result = testIfValidDeezerLink("https://example.com/123");

      expect(result).toBe(false);
    });
  });

  describe("testIfValidSpotifyLink", () => {
    it("should return true if the link is valid", () => {
      const result = testIfValidSpotifyLink(
        "https://open.spotify.com/track/123"
      );

      expect(result).toBe(true);
    });

    it("should return false if the link is invalid", () => {
      const result = testIfValidSpotifyLink("https://example.com/123");

      expect(result).toBe(false);
    });
  });

  describe("getSong", () => {
    it("should return an existing song if found", async () => {
      Song.findOne = jest.fn().mockResolvedValue(MOCK_SONG);
      const result = await getSong(MOCK_SONG);

      expect(result).toBe(MOCK_SONG);
      expect(Song.findOne).toHaveBeenCalledWith({
        providerUrl: MOCK_SONG.providerUrl,
      });
    });

    it("should create a new song if not found", async () => {
      Song.findOne = jest.fn().mockResolvedValue(null);
      Song.prototype.save = jest.fn().mockResolvedValue(MOCK_SONG);

      const result = await getSong(MOCK_SONG);

      expect(result).toBe(MOCK_SONG);
      expect(Song.findOne).toHaveBeenCalledWith({
        providerUrl: MOCK_SONG.providerUrl,
      });
      expect(Song.prototype.save).toHaveBeenCalled();
    });
  });

  describe("getSongs", () => {
    it("should return the songs in the playlist", async () => {
      Playlist.findById = jest.fn().mockResolvedValue(MOCK_PLAYLIST);
      Song.aggregate = jest.fn().mockResolvedValue([MOCK_SONG]);

      const result = await getSongs(MOCK_PLAYLIST._id);

      expect(result).toStrictEqual([MOCK_SONG]);
      expect(Playlist.findById).toHaveBeenCalledWith(MOCK_PLAYLIST._id);
      expect(Song.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            _id: { $in: MOCK_PLAYLIST.songs },
          },
        },
        {
          $addFields: {
            __order: {
              $indexOfArray: [MOCK_PLAYLIST.songs, "$_id"],
            },
          },
        },
        {
          $sort: {
            __order: 1,
          },
        },
      ]);
    });

    it("should return an error if the playlist is not found", async () => {
      Playlist.findById = jest.fn().mockResolvedValue(null);

      await expect(getSongs(MOCK_PLAYLIST._id)).rejects.toEqual({
        message: "Playlist not found",
        status: 404,
      });
    });

    it("should return an error if the songs are not found", async () => {
      Playlist.findById = jest.fn().mockResolvedValue(MOCK_PLAYLIST);
      Song.aggregate = jest.fn().mockResolvedValue(null);

      await expect(getSongs(MOCK_PLAYLIST._id)).rejects.toEqual({
        message: "Songs not found",
        status: 404,
      });
    });
  });
});
