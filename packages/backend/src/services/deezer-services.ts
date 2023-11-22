import axios from "axios";

type Track = {
  name: string;
  artist: string;
  album: string;
  providerUrl: string;
  imageUrl: string;
};

export const getTrackIdFromDeezerUrl = (url: string): string | null => {
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

export const deezerUrlFetch = async (url: string): Promise<Track> => {
  try {
    const share_url = await getRedirectLink(url);
    const id = getTrackIdFromDeezerUrl(share_url);
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
      imageUrl: response.data.album.cover,
    };

    return track;
  } catch (error: unknown) {
    console.error("Error Searching for songs:", error);
    throw error;
  }
};

export const deezerFetch = async (
  title: string,
  album: string,
  artist: string
): Promise<string> => {
  const response = await axios.get(
    `https://api.deezer.com/search?q="${title} ${artist} ${album}"`,
    {
      params: {
        apikey: process.env.DEEZER_KEY,
      },
    }
  );
  return response.data[0].id ? response.data[0].id : "";
};
