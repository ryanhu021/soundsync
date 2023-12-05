import {
  Track,
  spotifyApi,
  spotifySongFetch,
  spotifyAuthUrl,
} from "../../src/services/spotify-services";

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

const MOCK_TRACK: Track = {
  name: MOCK_TITLE,
  artist: MOCK_ARTIST_NAME,
  album: MOCK_ALBUM_NAME,
  providerUrl: MOCK_PROVIDER_URL,
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
};

describe("Spotify Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("spotifySongFetch", () => {
    it("should fetch and return track data from Spotify API", async () => {
      const result = await spotifySongFetch(MOCK_PROVIDER_URL);

      expect(result).toEqual(MOCK_TRACK);
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

  describe("spotifyAuthUrl", () => {
    it("should return a valid Spotify auth URL", () => {
      const result = spotifyAuthUrl();

      expect(result).toEqual(
        `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.CLIENT_URL}/auth/spotify/callback&scope=playlist-modify-public%20playlist-modify-private&state=soundsync-state`
      );
    });
  });
});
