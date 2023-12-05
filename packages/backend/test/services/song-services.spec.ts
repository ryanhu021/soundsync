import {
  testIfValidDeezerLink,
  testIfValidSpotifyLink,
  getSong,
  getSongByID,
} from "../../src/services/song-services";
import { Song } from "../../src/models/song-model";

jest.mock("../../src/models/song-model");

const MOCK_SONG = {
  _id: "song123",
  name: "Song Name",
  artist: "Artist Name",
  album: "Album Name",
  providerUrl: "https://example.com/song",
  imageUrl: "https://example.com/song/image.jpg",
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

  describe("getSongByID", () => {
    it("should return a song if found", async () => {
      Song.findById = jest.fn().mockResolvedValue(MOCK_SONG);

      const result = await getSongByID(MOCK_SONG._id);

      expect(result).toBe(MOCK_SONG);
      expect(Song.findById).toHaveBeenCalledWith(MOCK_SONG._id);
    });

    it("should return an error if not found", async () => {
      Song.findById = jest.fn().mockResolvedValue(null);

      await expect(getSongByID(MOCK_SONG._id)).rejects.toEqual({
        message: "Song not found",
        status: 404,
      });

      expect(Song.findById).toHaveBeenCalledWith(MOCK_SONG._id);
    });
  });
});
