import SpotifyWebApi from "spotify-web-api-node";

type Song = {
  name: string;
  artist: string;
  album: string;
  providerUrl: string;
};

const spotifyApi = new SpotifyWebApi({
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

export const spotifySongFetch = async (url: string): Promise<Song> => {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body["access_token"]);

  const songId = getSongIdFromUrl(url);
  if (songId) {
    try {
      const trackInfo = await spotifyApi.getTrack(songId);
      const songData = trackInfo.body;

      const track: Song = {
        name: songData.name,
        artist: songData.artists.map((artist) => artist.name).join(", "),
        album: songData.album.name,
        providerUrl: `https://open.spotify.com/track/${songId}`,
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
