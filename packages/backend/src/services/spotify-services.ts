import SpotifyWebApi from "spotify-web-api-node";
import { UserContext } from "../util/auth";
import { Playlist } from "../models/playlist-model";
import { Song } from "../models/song-model";

export type Track = {
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

const scopes = ["playlist-modify-public", "playlist-modify-private"];
const redirectUri = `${process.env.CLIENT_URL}/auth/spotify/callback`;

const spotifyApi = new SpotifyWebApi({
  redirectUri,
  clientId: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
});

// Function to extract song ID from Spotify URL
const getSongIdFromUrl = (url: string): string | null => {
  const urlObj = new URL(url);
  const pathSegments: string[] = urlObj.pathname.split("/");

  // Find the index of "track" in the path
  const trackIdIndex: number = pathSegments.indexOf("track");
  if (trackIdIndex !== -1 && trackIdIndex < pathSegments.length - 1) {
    return pathSegments[trackIdIndex + 1];
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

const getTrackUriFromSong = async (song: Song): Promise<string | null> => {
  if (song.providerUrl.includes("spotify")) {
    return `spotify:track:${getSongIdFromUrl(song.providerUrl)}`;
  }
  const searchResponse = await spotifyApi.searchTracks(
    `${song.name} ${song.artist} ${song.album}`,
    { limit: 1 }
  );
  if (searchResponse.body.tracks?.items?.length) {
    return searchResponse.body.tracks.items[0].uri;
  }
  return null;
};

// Function to authorize user
const authorizeUser = async (token: string) => {
  const authResult = await spotifyApi.authorizationCodeGrant(token);
  if (authResult.statusCode !== 200) {
    throw new Error("Authorization failed");
  }
  spotifyApi.setAccessToken(authResult.body.access_token);
};

// Function to fetch tracks from a playlist
const fetchTracksFromPlaylist = async (playlist: any) => {
  const trackUris = await Promise.all(
    playlist.songs.map(async (songId: string) => {
      const song = await Song.findById(songId);
      return song && getTrackUriFromSong(song);
    })
  );
  return trackUris.filter((trackId) => trackId !== null);
};

// Function to create a new playlist
const createNewPlaylist = async (playlistName: string) => {
  const createPlaylistResponse = await spotifyApi.createPlaylist(playlistName, {
    description: `Created by SoundSync: ${process.env.CLIENT_URL}`,
  });
  if (createPlaylistResponse.statusCode !== 201) {
    throw new Error("Failed to create playlist");
  }
  return createPlaylistResponse.body.id;
};

// Function to add tracks to a playlist
const addTracksToPlaylist = async (
  createPlaylistResponse: any,
  trackUris: string[]
) => {
  const addTracksResponse = await spotifyApi.addTracksToPlaylist(
    createPlaylistResponse.body.id,
    trackUris
  );
  if (addTracksResponse.statusCode !== 201) {
    await spotifyApi.unfollowPlaylist(createPlaylistResponse.body.id);
    throw new Error("Failed to add tracks to playlist");
  }
  return createPlaylistResponse.body.external_urls.spotify;
};

// Main export function
export const spotifyExport = async (
  token: string,
  playlistId: string
): Promise<ExportResult> => {
  try {
    await authorizeUser(token);

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    const trackUris = await fetchTracksFromPlaylist(playlist);
    const newPlaylistId = await createNewPlaylist(playlist.name);
    const playlistUrl = await addTracksToPlaylist(newPlaylistId, trackUris);

    return {
      url: playlistUrl,
      count: trackUris.length,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const spotifyAuthUrl = (state: string): string => {
  return spotifyApi.createAuthorizeURL(scopes, state);
};
