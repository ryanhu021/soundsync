import axios from "axios";

type Track = {
  name: string;
  artist: string;
  album: string;
  providerUrl: string;
  imageUrl: string;
};

const scopes = "manage_library,delete_library";
const redirectUri = `${process.env.CLIENT_URL}/auth/deezer/callback`;

const extractTrackIdFromDeezerUrl = (url: string): string | null => {
  const urlObj = new URL(url);
  const pathSegments: string[] = urlObj.pathname.split("/");

  // Find the index of "track" in the path
  const trackIndex: number = pathSegments.indexOf("track");

  // Return the track ID if "track" is found in the path
  return trackIndex !== -1 && pathSegments.length > trackIndex + 1
    ? pathSegments[trackIndex + 1]
    : null;
};

const getRedirectLink = async (url: string): Promise<string> => {
  const response = await axios.get(url);
  // Return redirect URL
  const finalUrl = response.request.res.responseUrl;
  return finalUrl;
};

export const deezerUrlSearch = async (url: string): Promise<Track> => {
  try {
    const share_url = await getRedirectLink(url);
    const id = extractTrackIdFromDeezerUrl(share_url);
    const response = await axios.get(`https://api.deezer.com/track/${id}`, {
      params: {
        apikey: process.env.DEEZER_KEY,
      },
    });

    const track: Track = {
      name: response.data.title,
      artist: response.data.artist.name,
      album: response.data.album.title,
      providerUrl: `https://deezer.com/track/${id}`,
      imageUrl: response.data.album.cover_big,
    };

    return track;
  } catch (error: unknown) {
    console.error("Error Searching for songs:", error);
    throw error;
  }
};

export const deezerAuthUrl = (id: string): string => {
  return (
    `https://connect.deezer.com/oauth/auth.php?app_id=${process.env.DEEZER_APP_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&perms=${scopes}` +
    `&state=${id}`
  );
};
