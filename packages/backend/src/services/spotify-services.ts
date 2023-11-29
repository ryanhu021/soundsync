import SpotifyWebApi from "spotify-web-api-node";

export type Track = {
  name: string;
  artist: string;
  album: string;
  providerUrl: string;
  imageUrl: string;
};

export type PlaylistResult = {
  status: number;
  message: string;
};

const scopes = ["playlist-modify-public", "playlist-modify-private"];
const redirectUri = `${process.env.CLIENT_URL}/auth/spotify/callback`;
const state = "soundsync-state";

const spotifyApi = new SpotifyWebApi({
  redirectUri,
  clientId: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
});

// Function to extract song ID from Spotify URL
const getSongIdFromUrl = (url: string): string | null => {
  const parts = url.split("/");
  const trackIdIndex = parts.indexOf("track");
  if (trackIdIndex !== -1 && trackIdIndex < parts.length - 1) {
    return parts[trackIdIndex + 1];
  }
  return null;
};

export const spotifySongFetch = async (url: string): Promise<Track> => {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body["access_token"]);

  const songId = getSongIdFromUrl(url);
  if (songId) {
    try {
      const trackInfo = await spotifyApi.getTrack(songId);
      const songData = trackInfo.body;

      const track: Track = {
        name: songData.name,
        artist: songData.artists[0].name,
        album: songData.album.name,
        providerUrl: `https://open.spotify.com/track/${songId}`,
        imageUrl: songData.album.images[0].url,
      };

      return track;
    } catch (error) {
      console.error("Error searching for songs:", error);
      throw error;
    }
  } else {
    console.error("Unable to find song ID in URL");
    throw new Error("Invalid Spotify URL");
  }
};

export const spotifyAuthUrl = (): string => {
  return spotifyApi.createAuthorizeURL(scopes, state);
};
