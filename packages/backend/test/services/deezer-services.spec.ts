import axios from "axios";
import {
  deezerUrlSearch,
  deezerAuthUrl,
} from "../../src/services/deezer-services";

jest.mock("axios");

const MOCK_SEARCH_URL = "https://deezer.page.link/123";
const MOCK_TRACK_ID = "123";
const MOCK_TITLE = "Song Name";
const MOCK_ARTIST_NAME = "Artist Name";
const MOCK_ALBUM_TITLE = "Album Title";
const MOCK_PROVIDER_URL = "https://deezer.com/track/123";
const MOCK_IMAGE_URL = "https://example.com/song/image.jpg";
const MOCK_PLAYLIST_ID = "456";

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

describe("Deezer Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        `https://connect.deezer.com/oauth/auth.php?app_id=${process.env.DEEZER_APP_ID}&redirect_uri=${process.env.CLIENT_URL}/auth/deezer/callback&perms=manage_library,delete_library&state=${MOCK_PLAYLIST_ID}`
      );
    });
  });
});
