import {
  Track,
  spotifyApi,
  spotifySongFetch,
  spotifyAuthUrl,
  spotifyExport,
} from "../../src/services/spotify-services";
import { MOCK_PLAYLIST } from "./playlist-services.spec";
import { Song } from "../../src/models/song-model";
import { Playlist } from "../../src/models/playlist-model";

jest.mock("../../src/models/song-model");
jest.mock("../../src/models/playlist-model");

const MOCK_TRACK_ID = "123";
const MOCK_TITLE = "Song Name";
const MOCK_ARTIST_NAME = "Artist Name";
const MOCK_ALBUM_NAME = "Album Title";
const MOCK_PROVIDER_URL = "https://open.spotify.com/track/123";
const MOCK_IMAGE_URL = "https://example.com/song/image.jpg";

const MOCK_CLIENT_CREDENTIALS_GRANT_RESPONSE = {
  body: {
    access_token: "mock-access-token",
  },
};

const MOCK_TRACK_INFO_RESPONSE = {
  body: {
    name: MOCK_TITLE,
    artists: [{ name: MOCK_ARTIST_NAME }],
    album: {
      name: MOCK_ALBUM_NAME,
      images: [{ url: MOCK_IMAGE_URL }],
    },
  },
};

const MOCK_AUTHORIZATION_CODE_GRANT_RESPONSE = {
  body: {
    access_token: "mock-access-token",
  },
  statusCode: 200,
};

const MOCK_SEARCH_TRACKS_RESPONSE = {
  body: {
    tracks: {
      items: [MOCK_TRACK_INFO_RESPONSE.body],
    },
  },
};

const MOCK_CREATE_PLAYLIST_RESPONSE = {
  body: {
    id: "mock-playlist-id",
    external_urls: {
      spotify: "https://open.spotify.com/playlist/mock-playlist-id",
    },
  },
  statusCode: 201,
};

const MOCK_ADD_TRACKS_TO_PLAYLIST_RESPONSE = {
  body: {
    snapshot_id: "mock-snapshot-id",
  },
  statusCode: 201,
};

export const MOCK_SPOTIFY_TRACK: Track | Song = {
  name: MOCK_TITLE,
  artist: MOCK_ARTIST_NAME,
  album: MOCK_ALBUM_NAME,
  providerUrl: MOCK_PROVIDER_URL,
  imageUrl: MOCK_IMAGE_URL,
};

export const MOCK_DEEZER_TRACK: Track | Song = {
  name: MOCK_TITLE,
  artist: MOCK_ARTIST_NAME,
  album: MOCK_ALBUM_NAME,
  providerUrl: "https://deezer.com/track/123",
  imageUrl: MOCK_IMAGE_URL,
};

const MOCK_API = {
  clientCredentialsGrant: (
    jest.spyOn(spotifyApi, "clientCredentialsGrant") as jest.SpyInstance
  ).mockResolvedValue(MOCK_CLIENT_CREDENTIALS_GRANT_RESPONSE),
  setAccessToken: jest.spyOn(spotifyApi, "setAccessToken"),
  getTrack: (
    jest.spyOn(spotifyApi, "getTrack") as jest.SpyInstance
  ).mockResolvedValue(MOCK_TRACK_INFO_RESPONSE),
  authorizationCodeGrant: (
    jest.spyOn(spotifyApi, "authorizationCodeGrant") as jest.SpyInstance
  ).mockResolvedValue(MOCK_AUTHORIZATION_CODE_GRANT_RESPONSE),
  searchTracks: (
    jest.spyOn(spotifyApi, "searchTracks") as jest.SpyInstance
  ).mockResolvedValue(MOCK_SEARCH_TRACKS_RESPONSE),
  createPlaylist: (
    jest.spyOn(spotifyApi, "createPlaylist") as jest.SpyInstance
  ).mockResolvedValue(MOCK_CREATE_PLAYLIST_RESPONSE),
  addTracksToPlaylist: (
    jest.spyOn(spotifyApi, "addTracksToPlaylist") as jest.SpyInstance
  ).mockResolvedValue(MOCK_ADD_TRACKS_TO_PLAYLIST_RESPONSE),
  unfollowPlaylist: (
    jest.spyOn(spotifyApi, "unfollowPlaylist") as jest.SpyInstance
  ).mockResolvedValue({}),
};

describe("Spotify Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Song.findById = jest.fn().mockResolvedValue(MOCK_SPOTIFY_TRACK);
    Playlist.findById = jest.fn().mockResolvedValue(MOCK_PLAYLIST);
  });

  describe("spotifySongFetch", () => {
    it("should fetch and return track data from Spotify API", async () => {
      const result = await spotifySongFetch(MOCK_PROVIDER_URL);

      expect(result).toEqual(MOCK_SPOTIFY_TRACK);
      expect(MOCK_API.clientCredentialsGrant).toHaveBeenCalled();
      expect(MOCK_API.setAccessToken).toHaveBeenCalledWith(
        MOCK_CLIENT_CREDENTIALS_GRANT_RESPONSE.body.access_token
      );
      expect(MOCK_API.getTrack).toHaveBeenCalledWith(MOCK_TRACK_ID);
    });

    it("should throw an error if unable to find song ID in URL", async () => {
      await expect(
        spotifySongFetch("https://open.spotify.com/track")
      ).rejects.toThrow();

      expect(MOCK_API.clientCredentialsGrant).toHaveBeenCalled();
      expect(MOCK_API.setAccessToken).toHaveBeenCalledWith(
        MOCK_CLIENT_CREDENTIALS_GRANT_RESPONSE.body.access_token
      );
      expect(MOCK_API.getTrack).not.toHaveBeenCalled();
    });

    it("should throw an error if there is an error searching for songs", async () => {
      MOCK_API.getTrack.mockRejectedValueOnce(new Error("Mock Error"));

      await expect(spotifySongFetch(MOCK_PROVIDER_URL)).rejects.toThrow();

      expect(MOCK_API.clientCredentialsGrant).toHaveBeenCalled();
      expect(MOCK_API.setAccessToken).toHaveBeenCalledWith(
        MOCK_CLIENT_CREDENTIALS_GRANT_RESPONSE.body.access_token
      );
      expect(MOCK_API.getTrack).toHaveBeenCalledWith(MOCK_TRACK_ID);
    });
  });

  describe("spotifyExport", () => {
    it("should export a playlist with all Spotify songs to Spotify", async () => {
      const result = await spotifyExport("mock-token", MOCK_PLAYLIST._id);

      expect(result).toEqual({
        count: 2,
        url: MOCK_CREATE_PLAYLIST_RESPONSE.body.external_urls.spotify,
      });
      expect(MOCK_API.authorizationCodeGrant).toHaveBeenCalledWith(
        "mock-token"
      );
      expect(MOCK_API.setAccessToken).toHaveBeenCalledWith(
        MOCK_AUTHORIZATION_CODE_GRANT_RESPONSE.body.access_token
      );
      expect(MOCK_API.searchTracks).not.toHaveBeenCalled();
      expect(MOCK_API.createPlaylist).toHaveBeenCalledWith(MOCK_PLAYLIST.name, {
        description: `Created by SoundSync: ${process.env.CLIENT_URL}`,
      });
      expect(MOCK_API.addTracksToPlaylist).toHaveBeenCalledWith(
        MOCK_CREATE_PLAYLIST_RESPONSE.body.id,
        [`spotify:track:${MOCK_TRACK_ID}`, `spotify:track:${MOCK_TRACK_ID}`]
      );
    });

    it("should export a playlist with Spotify and Deezer songs to Spotify", async () => {
      Song.findById = jest
        .fn()
        .mockResolvedValueOnce(MOCK_DEEZER_TRACK)
        .mockResolvedValueOnce(MOCK_SPOTIFY_TRACK);

      const result = await spotifyExport("mock-token", MOCK_PLAYLIST._id);

      expect(result).toEqual({
        count: 2,
        url: MOCK_CREATE_PLAYLIST_RESPONSE.body.external_urls.spotify,
      });
    });

    it("should partially export a playlist if some songs are not found", async () => {
      Song.findById = jest
        .fn()
        .mockResolvedValueOnce(MOCK_DEEZER_TRACK)
        .mockResolvedValueOnce(MOCK_SPOTIFY_TRACK);
      MOCK_API.searchTracks
        .mockResolvedValueOnce({
          body: {
            tracks: {
              items: [],
            },
          },
        })
        .mockResolvedValueOnce(MOCK_SEARCH_TRACKS_RESPONSE);

      const result = await spotifyExport("mock-token", MOCK_PLAYLIST._id);

      expect(result).toEqual({
        count: 1,
        url: MOCK_CREATE_PLAYLIST_RESPONSE.body.external_urls.spotify,
      });
    });

    it("should throw an error if playlist is not found", async () => {
      Playlist.findById = jest.fn().mockResolvedValueOnce(null);

      await expect(
        spotifyExport("mock-token", MOCK_PLAYLIST._id)
      ).rejects.toThrow(new Error("Playlist not found"));
    });

    it("should throw an error if user authorization fails", async () => {
      MOCK_API.authorizationCodeGrant.mockResolvedValueOnce({
        statusCode: 500,
      });

      await expect(
        spotifyExport("mock-token", MOCK_PLAYLIST._id)
      ).rejects.toThrow(new Error("Authorization failed"));

      expect(MOCK_API.setAccessToken).not.toHaveBeenCalled();
    });

    it("should throw an error if playlist fails to create", async () => {
      MOCK_API.createPlaylist.mockResolvedValueOnce({
        statusCode: 500,
      });

      await expect(
        spotifyExport("mock-token", MOCK_PLAYLIST._id)
      ).rejects.toThrow(new Error("Failed to create playlist"));

      expect(MOCK_API.addTracksToPlaylist).not.toHaveBeenCalled();
    });

    it("should throw an error if tracks fail to add to playlist", async () => {
      MOCK_API.addTracksToPlaylist.mockResolvedValueOnce({
        statusCode: 500,
      });

      await expect(
        spotifyExport("mock-token", MOCK_PLAYLIST._id)
      ).rejects.toThrow(new Error("Failed to add tracks to playlist"));

      expect(MOCK_API.unfollowPlaylist).toHaveBeenCalledWith(
        MOCK_CREATE_PLAYLIST_RESPONSE.body.id
      );
    });
  });

  describe("spotifyAuthUrl", () => {
    it("should return a valid Spotify auth URL", () => {
      const state = "mock-state";
      const result = spotifyAuthUrl(state);

      expect(result).toEqual(
        `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.CLIENT_URL}/auth/spotify/callback&scope=playlist-modify-public%20playlist-modify-private&state=${state}`
      );
    });
  });
});
