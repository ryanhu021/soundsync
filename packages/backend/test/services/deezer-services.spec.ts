import axios from "axios";
import {
  deezerUrlSearch,
  deezerAuthUrl,
  getAccessToken,
  deezerExport,
} from "../../src/services/deezer-services";
import { MOCK_DEEZER_TRACK, MOCK_SPOTIFY_TRACK } from "./spotify-services.spec";
import { Playlist } from "../../src/models/playlist-model";
import { MOCK_PLAYLIST } from "./playlist-services.spec";
import { Song } from "../../src/models/song-model";

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

// functions to test:
// export const deezerAuthUrl = (id: string): string => {
//   return (
//     `https://connect.deezer.com/oauth/auth.php?app_id=${process.env.DEEZER_APP_ID}` +
//     `&redirect_uri=${redirectUri}` +
//     `&perms=${scopes}` +
//     `&state=${id}`
//   );
// };

// export const getAccessToken = async (
//   code: string
// ): Promise<string | undefined> => {
//   const response = await axios.get(
//     `https://connect.deezer.com/oauth/access_token.php?app_id=${process.env.DEEZER_APP_ID}` +
//       `&secret=${process.env.DEEZER_KEY}` +
//       `&code=${code}` +
//       `&output=json`
//   );
//   const accessToken = response.data.access_token;
//   return accessToken;
// };

// const getUserId = async (token: string): Promise<string | null> => {
//   try {
//     const res = await axios.get(`https://api.deezer.com/user/me`, {
//       params: {
//         access_token: token,
//       },
//     });
//     if (res.data.id && typeof res.data.id === "number") {
//       return res.data.id.toString();
//     }
//     return res.data.id;
//   } catch (error) {
//     console.error(error);
//     return Promise.reject(error);
//   }
// };

// const fetchTrackUrisFromPlaylist = async (
//   playlist: Playlist
// ): Promise<string[]> =>
//   (
//     await Promise.all(
//       playlist.songs.map((songId) =>
//         Song.findById(songId).then((song) => song && getTrackUriFromSong(song))
//       )
//     )
//   ).filter((trackId: string | null) => trackId !== null) as string[];

// const getTrackUriFromSong = async (song: Song): Promise<string | null> => {
//   if (song.providerUrl.includes("deezer")) {
//     return `${getSongIdFromUrl(song.providerUrl)}`;
//   }
//   const searchResponse = await axios.get(
//     `https://api.deezer.com/search?q="${song.name} ${song.artist} ${song.album}"`,
//     {
//       params: {
//         apikey: process.env.DEEZER_KEY,
//         limit: 1,
//       },
//     }
//   );
//   if (searchResponse.data.data.length) {
//     return `${searchResponse.data.data[0].id}`;
//   }

//   return null;
// };

// const createPlaylistWithTracks = async (
//   playlistName: string,
//   tracks: string[],
//   token: string,
//   id: string
// ): Promise<string> => {
//   const title = encodeURIComponent(playlistName);
//   try {
//     const createResponse = await axios.post(
//       `https://api.deezer.com/user/${id}/playlists?access_token=${token}&title=${title}`
//     );
//     if (createResponse.status !== 200) {
//       throw new Error("Failed to create playlist");
//     }

//     const playlistId = createResponse.data.id;

//     const addResponse = await axios.post(
//       `https://api.deezer.com/playlist/${playlistId}/tracks?access_token=${token}&songs=${tracks.join()}`
//     );
//     if (addResponse.status !== 200) {
//       throw new Error("Failed to add songs to playlist");
//     }

//     return `https://www.deezer.com/playlist/${playlistId}`;
//   } catch (error) {
//     console.error(error);
//     return Promise.reject(error);
//   }
// };

// export const deezerExport = async (
//   token: string,
//   playlistId: string
// ): Promise<ExportResult> => {
//   try {
//     const userId = await getUserId(token);
//     if (!userId) {
//       throw new Error("User ID not found");
//     }

//     const playlist = await Playlist.findById(playlistId);
//     if (!playlist) {
//       throw new Error("Playlist not found");
//     }
//     const tracks = await fetchTrackUrisFromPlaylist(playlist);
//     const playlistUrl = await createPlaylistWithTracks(
//       playlist.name,
//       tracks,
//       token,
//       userId
//     );
//     return { url: playlistUrl, count: tracks.length };
//   } catch (error) {
//     console.error(error);
//     return Promise.reject(error);
//   }
// };

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
    it("should return a valid Deezer auth URL", () => {
      const result = deezerAuthUrl(MOCK_PLAYLIST_ID);

      expect(result).toEqual(
        `https://connect.deezer.com/oauth/auth.php?app_id=${process.env.DEEZER_APP_ID}&redirect_uri=${process.env.CLIENT_URL}/auth/deezer/callback&perms=manage_library,delete_library,basic_access&state=${MOCK_PLAYLIST_ID}`
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
});
