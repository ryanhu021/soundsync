import axios from "axios";
import { Playlist } from "../models/playlist-model";
import { Song } from "../models/song-model";

type Track = {
  name: string;
  artist: string;
  album: string;
  providerUrl: string;
  imageUrl: string;
};

export type ExportResult = {
  url: string;
  count: number;
};

const scopes = "manage_library,delete_library,basic_access";
const redirectUri = `${process.env.CLIENT_URL}/auth/deezer/callback`;

const getSongIdFromUrl = (url: string): string | null => {
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
    const id = getSongIdFromUrl(share_url);
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

export const getAccessToken = async (
  code: string
): Promise<string | undefined> => {
  const response = await axios.get(
    `https://connect.deezer.com/oauth/access_token.php?app_id=${process.env.DEEZER_APP_ID}` +
      `&secret=${process.env.DEEZER_KEY}` +
      `&code=${code}` +
      `&output=json`
  );
  const accessToken = response.data.access_token;
  return accessToken;
};

const createPlaylistWithTracks = async (
  playlistName: string,
  tracks: string[],
  token: string,
  id: string
): Promise<string> => {
  console.log(token + " " + typeof token);
  console.log(id + " " + typeof id);
  try {
    const response = await axios.post(
      `https://api.deezer.com/user/${id}/playlists?access_token=${token}&title=${playlistName}}`
    );

    const playlistId = response.data.id;
    console.log(`Playlist created with ID: ${playlistId}`);

    await axios.post(
      `https://api.deezer.com/playlist/${playlistId}/tracks?access_token=${token}&songs=${tracks.join()}`
    );

    return `https://www.deezer.com/playlist/${playlistId}`;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const deezerExport = async (
  token: string,
  playlistId: string
): Promise<ExportResult> => {
  try {
    const userId = await getUserId(token);
    if (!userId) {
      throw new Error("User ID not found");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    const tracks = await fetchTrackUrisFromPlaylist(playlist);
    const playlistUrl = await createPlaylistWithTracks(
      playlist.name,
      tracks,
      token,
      userId
    );
    return { url: playlistUrl, count: tracks.length };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const getUserId = async (token: string): Promise<string | null> => {
  try {
    const res = await axios.get(`https://api.deezer.com/user/me`, {
      params: {
        access_token: token,
      },
    });
    console.log(res.data.id);
    if (res.data.id && typeof res.data.id === "number") {
      return res.data.id.toString();
    }
    return res.data.id;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const fetchTrackUrisFromPlaylist = async (
  playlist: Playlist
): Promise<string[]> =>
  (
    await Promise.all(
      playlist.songs.map((songId) =>
        Song.findById(songId).then((song) => song && getTrackUriFromSong(song))
      )
    )
  ).filter((trackId: string | null) => trackId !== null) as string[];

const getTrackUriFromSong = async (song: Song): Promise<string | null> => {
  if (song.providerUrl.includes("deezer")) {
    return `${getSongIdFromUrl(song.providerUrl)}`;
  }
  const searchResponse = await axios.get(
    `https://api.deezer.com/search?q="${song.name} ${song.artist} ${song.album}`,
    {
      params: {
        apikey: process.env.DEEZER_KEY,
        limit: 1,
      },
    }
  );
  if (searchResponse.data.data.length) {
    return `${searchResponse.data.data[0].id}`;
  }

  return null;
};
