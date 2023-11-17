import axios from "axios";

type Song = {
  name: string;
  artist: string;
  album: string;
  providerUrl: string;
};

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

export const deezerUrlSearch = async (url: string): Promise<Song> => {
  try {
    const share_url = await getRedirectLink(url);
    const id = extractTrackIdFromDeezerUrl(share_url);
    const response = await axios.get(`https://api.deezer.com/track/${id}`, {
      params: {
        apikey: process.env.DEEZER_KEY,
      },
    });

    const track: Song = {
      name: response.data.title,
      artist: response.data.artist.name,
      album: response.data.album.title,
      providerUrl: `https://deezer.com/track/${id}`,
    };

    return track;
  } catch (error: unknown) {
    console.error("Error Searching for songs:", error);
    throw error;
  }
};