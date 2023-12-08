import axios from "axios";
import {
  deezerUrlSearch,
  deezerAuthUrl,
  getAccessToken,
  deezerExport,
  deezerImport,
} from "../../src/services/deezer-services";
import { Playlist } from "../../src/models/playlist-model";
import { Song } from "../../src/models/song-model";
import { UserContext } from "../../src/util/auth";
import {
  MOCK_DEEZER_TRACK,
  MOCK_PLAYLIST,
  MOCK_SPOTIFY_TRACK,
} from "../shared-mocks";

jest.mock("axios");
jest.mock("../../src/models/song-model");
jest.mock("../../src/models/playlist-model");

const MOCK_SEARCH_URL = "https://deezer.page.link/123";
const MOCK_TRACK_ID = "123";
const MOCK_TITLE = "Song Name";
const MOCK_ARTIST_NAME = "Artist Name";
const MOCK_ALBUM_TITLE = "Album Title";
const MOCK_PROVIDER_URL = "https://deezer.com/track/123";
const MOCK_IMAGE_URL = "https://example.com/song/image.jpg";
const MOCK_PLAYLIST_ID = "456";
const MOCK_ACCESS_TOKEN = "mock-access-token";
const MOCK_TYPE_IMPORT = "import";
const MOCK_TYPE_EXPORT = "export";
const MOCK_PLAYLIST_URL = "https://www.deezer.com/playlist/123";

const MOCK_REDIRECT_RESPONSE = {
  request: {
    res: {
      responseUrl: MOCK_PROVIDER_URL,
    },
  },
};

const MOCK_URL_SEARCH_RESPONSE = {
  data: {
    title: MOCK_TITLE,
    artist: { name: MOCK_ARTIST_NAME },
    album: { title: MOCK_ALBUM_TITLE, cover_big: MOCK_IMAGE_URL },
  },
};

const MOCK_ACCESS_TOKEN_RESPONSE = {
  data: {
    access_token: MOCK_ACCESS_TOKEN,
  },
};

const MOCK_TRACK_SEARCH_RESPONSE = {
  data: {
    data: [
      {
        id: MOCK_TRACK_ID,
      },
    ],
  },
};

const MOCK_USER_ID_RESPONSE = {
  data: {
    id: "mock-user-id",
  },
  status: 200,
};

const MOCK_CREATE_PLAYLIST_RESPONSE = {
  data: {
    id: "mock-playlist-id",
  },
  status: 200,
};

const MOCK_ADD_TRACKS_RESPONSE = {
  status: 200,
};

const MOCK_USER_CONTEXT = {
  _id: "mock-user-id",
  name: "Mock User",
  email: "mock@user.com",
};

const MOCK_GET_PLAYLIST_RESPONSE = {
  data: {
    id: "mock-playlist-id",
    title: "Mock Playlist",
    picture_big: "https://example.com/playlist/image.jpg",
    nb_tracks: 2,
    tracks: {
      data: [
        {
          id: "mock-track-id-1",
          title: "Mock Track 1",
          artist: {
            name: "Mock Artist 1",
          },
          album: {
            title: "Mock Album 1",
            cover_big: "https://example.com/album/image.jpg",
          },
        },
        {
          id: "mock-track-id-2",
          title: "Mock Track 2",
          artist: {
            name: "Mock Artist 2",
          },
          album: {
            title: "Mock Album 2",
            cover_big: "https://example.com/album/image.jpg",
          },
        },
      ],
    },
  },
};

describe("Deezer Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Song.findById = jest.fn().mockResolvedValue(MOCK_DEEZER_TRACK);
    Playlist.findById = jest.fn().mockResolvedValue(MOCK_PLAYLIST);
  });

  describe("deezerUrlSearch", () => {
    it("should fetch and return track data from Deezer API", async () => {
      axios.get = jest
        .fn()
        .mockResolvedValueOnce(MOCK_REDIRECT_RESPONSE)
        .mockResolvedValueOnce(MOCK_URL_SEARCH_RESPONSE);

      const result = await deezerUrlSearch(MOCK_SEARCH_URL);

      expect(result).toEqual({
        name: MOCK_TITLE,
        artist: MOCK_ARTIST_NAME,
        album: MOCK_ALBUM_TITLE,
        providerUrl: MOCK_PROVIDER_URL,
        imageUrl: MOCK_IMAGE_URL,
      });
      expect(axios.get).toHaveBeenCalledWith(MOCK_SEARCH_URL);
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.deezer.com/track/${MOCK_TRACK_ID}`,
        {
          params: {
            apikey: process.env.DEEZER_KEY,
          },
        }
      );
    });

    it("should throw an error if unable to find song ID in URL", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        request: {
          res: {
            responseUrl: "https://deezer.com/track",
          },
        },
      });

      await expect(deezerUrlSearch(MOCK_SEARCH_URL)).rejects.toThrow(
        new Error("Unable to find song ID in URL")
      );

      expect(axios.get).toHaveBeenCalledWith(MOCK_SEARCH_URL);
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if there is an error fetching the redirect URL", async () => {
      const mockError = new Error("Mock Error");
      axios.get = jest.fn().mockRejectedValueOnce(mockError);

      await expect(deezerUrlSearch(MOCK_SEARCH_URL)).rejects.toThrow(mockError);

      expect(axios.get).toHaveBeenCalledWith(MOCK_SEARCH_URL);
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if there is an error searching for songs", async () => {
      const mockError = new Error("Mock Error");
      axios.get = jest
        .fn()
        .mockResolvedValueOnce(MOCK_REDIRECT_RESPONSE)
        .mockRejectedValueOnce(mockError);

      await expect(deezerUrlSearch(MOCK_SEARCH_URL)).rejects.toThrow(mockError);

      expect(axios.get).toHaveBeenCalledWith(MOCK_SEARCH_URL);
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.deezer.com/track/${MOCK_TRACK_ID}`,
        {
          params: {
            apikey: process.env.DEEZER_KEY,
          },
        }
      );
    });
  });

  describe("deezerAuthUrl", () => {
    it("should return a valid Deezer auth URL when importing", () => {
      const result = deezerAuthUrl(MOCK_PLAYLIST_ID, MOCK_TYPE_IMPORT);

      expect(result).toEqual(
        `https://connect.deezer.com/oauth/auth.php?app_id=${process.env.DEEZER_APP_ID}&redirect_uri=${process.env.CLIENT_URL}/auth/deezer/callback&perms=manage_library,delete_library,basic_access&state=${MOCK_PLAYLIST_ID},${MOCK_TYPE_IMPORT}`
      );
    });
    it("should return a valid Deezer auth URL when exporting", () => {
      const result = deezerAuthUrl(MOCK_PLAYLIST_ID, MOCK_TYPE_EXPORT);

      expect(result).toEqual(
        `https://connect.deezer.com/oauth/auth.php?app_id=${process.env.DEEZER_APP_ID}&redirect_uri=${process.env.CLIENT_URL}/auth/deezer/callback&perms=manage_library,delete_library,basic_access&state=${MOCK_PLAYLIST_ID},${MOCK_TYPE_EXPORT}`
      );
    });
  });

  describe("getAccessToken", () => {
    it("should return an access token", async () => {
      axios.get = jest.fn().mockResolvedValueOnce(MOCK_ACCESS_TOKEN_RESPONSE);

      const result = await getAccessToken("mock-code");

      expect(result).toEqual(MOCK_ACCESS_TOKEN);
      expect(axios.get).toHaveBeenCalledWith(
        `https://connect.deezer.com/oauth/access_token.php?app_id=${process.env.DEEZER_APP_ID}&secret=${process.env.DEEZER_KEY}&code=mock-code&output=json`
      );
    });

    it("should throw an error if there is an error fetching the access token", async () => {
      const mockError = new Error("Mock Error");
      axios.get = jest.fn().mockRejectedValueOnce(mockError);

      await expect(getAccessToken("mock-code")).rejects.toThrow(mockError);

      expect(axios.get).toHaveBeenCalledWith(
        `https://connect.deezer.com/oauth/access_token.php?app_id=${process.env.DEEZER_APP_ID}&secret=${process.env.DEEZER_KEY}&code=mock-code&output=json`
      );
    });
  });

  //Would Not Contribute to line coverage for some reason so there are more at the bottom
  describe("deezerExport", () => {
    it("should export a playlist with all Deezer songs to Spotify", async () => {
      axios.get = jest.fn().mockResolvedValueOnce(MOCK_USER_ID_RESPONSE);
      axios.post = jest
        .fn()
        .mockResolvedValueOnce(MOCK_CREATE_PLAYLIST_RESPONSE)
        .mockResolvedValueOnce(MOCK_ADD_TRACKS_RESPONSE);

      const result = await deezerExport("mock-token", "mock-playlist-id");

      expect(result).toEqual({
        url: `https://www.deezer.com/playlist/${MOCK_CREATE_PLAYLIST_RESPONSE.data.id}`,
        count: 2,
      });
    });

    it("should export a playlist with Spotify and Deezer songs to Deezer", async () => {
      Song.findById = jest
        .fn()
        .mockResolvedValueOnce(MOCK_DEEZER_TRACK)
        .mockResolvedValueOnce(MOCK_SPOTIFY_TRACK);
      axios.get = jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER_ID_RESPONSE)
        .mockResolvedValueOnce(MOCK_TRACK_SEARCH_RESPONSE);
      axios.post = jest
        .fn()
        .mockResolvedValueOnce(MOCK_CREATE_PLAYLIST_RESPONSE)
        .mockResolvedValueOnce(MOCK_ADD_TRACKS_RESPONSE);

      const result = await deezerExport("mock-token", "mock-playlist-id");

      expect(result).toEqual({
        url: `https://www.deezer.com/playlist/${MOCK_CREATE_PLAYLIST_RESPONSE.data.id}`,
        count: 2,
      });
    });

    it("should partially export a playlist if some songs are not found", async () => {
      Song.findById = jest
        .fn()
        .mockResolvedValueOnce(MOCK_DEEZER_TRACK)
        .mockResolvedValueOnce(MOCK_SPOTIFY_TRACK);
      axios.get = jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER_ID_RESPONSE)
        .mockResolvedValueOnce({
          data: {
            data: [],
          },
        });
      axios.post = jest
        .fn()
        .mockResolvedValueOnce(MOCK_CREATE_PLAYLIST_RESPONSE)
        .mockResolvedValueOnce(MOCK_ADD_TRACKS_RESPONSE);

      const result = await deezerExport("mock-token", "mock-playlist-id");

      expect(result).toEqual({
        url: `https://www.deezer.com/playlist/${MOCK_CREATE_PLAYLIST_RESPONSE.data.id}`,
        count: 1,
      });
    });

    it("should throw an error if playlist is not found", async () => {
      Playlist.findById = jest.fn().mockResolvedValueOnce(null);
      axios.get = jest.fn().mockResolvedValueOnce(MOCK_USER_ID_RESPONSE);

      await expect(
        deezerExport("mock-token", "mock-playlist-id")
      ).rejects.toThrow(new Error("Playlist not found"));
    });

    it("should throw an error if user authorization fails", async () => {
      axios.get = jest.fn().mockResolvedValueOnce({
        data: {
          id: null,
        },
      });

      await expect(
        deezerExport("mock-token", "mock-playlist-id")
      ).rejects.toThrow(new Error("User ID not found"));
    });

    it("should throw an error if playlist fails to create", async () => {
      axios.get = jest.fn().mockResolvedValueOnce(MOCK_USER_ID_RESPONSE);
      axios.post = jest.fn().mockResolvedValueOnce({
        status: 500,
      });

      await expect(
        deezerExport("mock-token", "mock-playlist-id")
      ).rejects.toThrow(new Error("Failed to create playlist"));
    });

    it("should throw an error if tracks fail to add to playlist", async () => {
      axios.get = jest.fn().mockResolvedValueOnce(MOCK_USER_ID_RESPONSE);
      axios.post = jest
        .fn()
        .mockResolvedValueOnce(MOCK_CREATE_PLAYLIST_RESPONSE)
        .mockResolvedValueOnce({
          status: 500,
        });

      await expect(
        deezerExport("mock-token", "mock-playlist-id")
      ).rejects.toThrow(new Error("Failed to add songs to playlist"));
    });

    it("should throw an error on general failure", async () => {
      axios.get = jest.fn().mockRejectedValueOnce(new Error("Mock Error"));

      await expect(
        deezerExport("mock-token", "mock-playlist-id")
      ).rejects.toThrow(new Error("Mock Error"));
    });
  });

  describe("deezerExport", () => {
    it("should export a playlist with all Deezer songs to Spotify", async () => {
      axios.get = jest.fn().mockResolvedValueOnce(MOCK_USER_ID_RESPONSE);
      axios.post = jest
        .fn()
        .mockResolvedValueOnce(MOCK_CREATE_PLAYLIST_RESPONSE)
        .mockResolvedValueOnce(MOCK_ADD_TRACKS_RESPONSE);

      const result = await deezerExport("mock-token", "mock-playlist-id");

      expect(result).toEqual({
        url: `https://www.deezer.com/playlist/${MOCK_CREATE_PLAYLIST_RESPONSE.data.id}`,
        count: 2,
      });
    });
    it("should export a playlist with Spotify and Deezer songs to Deezer", async () => {
      Song.findById = jest
        .fn()
        .mockResolvedValueOnce(MOCK_DEEZER_TRACK)
        .mockResolvedValueOnce(MOCK_SPOTIFY_TRACK);
      axios.get = jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER_ID_RESPONSE)
        .mockResolvedValueOnce(MOCK_TRACK_SEARCH_RESPONSE);
      axios.post = jest
        .fn()
        .mockResolvedValueOnce(MOCK_CREATE_PLAYLIST_RESPONSE)
        .mockResolvedValueOnce(MOCK_ADD_TRACKS_RESPONSE);

      const result = await deezerExport("mock-token", "mock-playlist-id");

      expect(result).toEqual({
        url: `https://www.deezer.com/playlist/${MOCK_CREATE_PLAYLIST_RESPONSE.data.id}`,
        count: 2,
      });
    });
    it("should partially export a playlist if some songs are not found", async () => {
      Song.findById = jest
        .fn()
        .mockResolvedValueOnce(MOCK_DEEZER_TRACK)
        .mockResolvedValueOnce(MOCK_SPOTIFY_TRACK);
      axios.get = jest
        .fn()
        .mockResolvedValueOnce(MOCK_USER_ID_RESPONSE)
        .mockResolvedValueOnce({
          data: {
            data: [],
          },
        });
      axios.post = jest
        .fn()
        .mockResolvedValueOnce(MOCK_CREATE_PLAYLIST_RESPONSE)
        .mockResolvedValueOnce(MOCK_ADD_TRACKS_RESPONSE);

      const result = await deezerExport("mock-token", "mock-playlist-id");

      expect(result).toEqual({
        url: `https://www.deezer.com/playlist/${MOCK_CREATE_PLAYLIST_RESPONSE.data.id}`,
        count: 1,
      });
    });
    it("should throw an error if playlist is not found", async () => {
      Playlist.findById = jest.fn().mockResolvedValueOnce(null);
      axios.get = jest.fn().mockResolvedValueOnce(MOCK_USER_ID_RESPONSE);

      await expect(
        deezerExport("mock-token", "mock-playlist-id")
      ).rejects.toThrow(new Error("Playlist not found"));
    });
  });

  //   describe("deezerImport", () => {
  //     it("should import a playlist from Deezer", async () => {
  //       axios.get = jest
  //         .fn()
  //         .mockResolvedValueOnce(MOCK_GET_PLAYLIST_RESPONSE)

  //       const result = await deezerImport(
  //         MOCK_USER_CONTEXT,
  //         MOCK_ACCESS_TOKEN,
  //         MOCK_PLAYLIST_URL
  //       );

  //       expect(result).toEqual(MOCK_PLAYLIST_ID);
  //     });

  //     it("should import a playlist from Spotify and Deezer", async () => {
  //       Song.findById = jest
  //         .fn()
  //         .mockResolvedValueOnce(MOCK_DEEZER_TRACK)
  //         .mockResolvedValueOnce(MOCK_SPOTIFY_TRACK);
  //       axios.get = jest
  //         .fn()
  //         .mockResolvedValueOnce(MOCK_USER_ID_RESPONSE)
  //         .mockResolvedValueOnce(MOCK_TRACK_SEARCH_RESPONSE);
  //       axios.post = jest
  //         .fn()
  //         .mockResolvedValueOnce(MOCK_CREATE_PLAYLIST_RESPONSE)
  //         .mockResolvedValueOnce(MOCK_ADD_TRACKS_RESPONSE);

  //       const result = await deezerImport(
  //         MOCK_USER_CONTEXT,
  //         MOCK_ACCESS_TOKEN,
  //         MOCK_PLAYLIST_URL
  //       );

  //       expect(result).toEqual({
  //         url: `https://www.deezer.com/playlist/${MOCK_CREATE_PLAYLIST_RESPONSE.data.id}`,
  //         count: 2,
  //       });
  //     });

  //     it("should partially import a playlist if some songs are not found", async () => {
  //       Song.findById = jest
  //         .fn()
  //         .mockResolvedValueOnce(MOCK_DEEZER_TRACK)
  //         .mockResolvedValueOnce(MOCK_SPOTIFY_TRACK);
  //       axios.get = jest
  //         .fn()
  //         .mockResolvedValueOnce(MOCK_USER_ID_RESPONSE)
  //         .mockResolvedValueOnce({
  //           data: {
  //             data: [],
  //           },
  //         });
  //       axios.post = jest
  //         .fn()
  //         .mockResolvedValueOnce(MOCK_CREATE_PLAYLIST_RESPONSE)
  //         .mockResolvedValueOnce(MOCK_ADD_TRACKS_RESPONSE);

  //       const result = await deezerImport(
  //         MOCK_USER_CONTEXT,
  //         MOCK_ACCESS_TOKEN,
  //         MOCK_PLAYLIST_URL
  //       );
  //     });
  //   });
  // });
});
