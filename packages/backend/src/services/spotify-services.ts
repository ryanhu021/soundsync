import SpotifyWebApi from "spotify-web-api-node";
import { Playlist } from "../models/playlist-model";
import { Song } from "../models/song-model";
import { getSong } from "./song-services";
import { createPlaylist, updatePlaylistByID } from "./playlist-services";
import { UserContext } from "../util/auth";

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

const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
  "user-library-modify",
];
const redirectUri = `${process.env.CLIENT_URL}/auth/spotify/callback`;

export const spotifyApi = new SpotifyWebApi({
  redirectUri,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
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
const authorizeUser = async (token: string): Promise<void> => {
  const authResult = await spotifyApi.authorizationCodeGrant(token);
  if (authResult.statusCode !== 200) {
    throw new Error("Authorization failed");
  }
  spotifyApi.setAccessToken(authResult.body.access_token);
};

// Function to fetch track URIs from a playlist
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

// Function to create a new playlist
const createNewPlaylistWithTracks = async (
  playlistName: string,
  trackUris: string[]
): Promise<string> => {
  const createPlaylistResponse = await spotifyApi.createPlaylist(playlistName, {
    description: `Created by SoundSync: ${process.env.CLIENT_URL}`,
  });
  if (createPlaylistResponse.statusCode !== 201) {
    throw new Error("Failed to create playlist");
  }
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

    const trackUris = await fetchTrackUrisFromPlaylist(playlist);
    const playlistUrl = await createNewPlaylistWithTracks(
      playlist.name,
      trackUris
    );

    return {
      url: playlistUrl,
      count: trackUris.length,
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const spotifyImport = async (
  user: UserContext,
  token: string,
  playlistUrl: string
): Promise<string> => {
  try {
    // authorize user
    await authorizeUser(token);

    // get playlist ID from URL
    const playlistId = playlistUrl.split("/").pop();
    if (!playlistId) {
      throw new Error("Invalid playlist URL");
    }

    // fetch playlist
    const playlist = await spotifyApi.getPlaylist(playlistId);
    if (playlist.statusCode !== 200) {
      throw new Error("Failed to fetch playlist");
    }
    const playlistName = playlist.body.name;

    // fetch tracks
    const tracks: Track[] = [];
    let length = 0;
    let hasNext = true;
    while (hasNext) {
      const nextTracks = await spotifyApi.getPlaylistTracks(playlistId, {
        offset: tracks.length,
      });
      if (nextTracks.statusCode !== 200) {
        throw new Error("Failed to fetch playlist");
      }
      tracks.push(
        ...nextTracks.body.items
          .map((item) => ({
            name: item.track?.name || "",
            artist: item.track?.artists[0].name || "",
            album: item.track?.album.name || "",
            providerUrl: item.track?.external_urls.spotify || "",
            imageUrl: item.track?.album.images[0].url || "",
          }))
          .filter((track) => track.providerUrl)
      );
      length = nextTracks.body.items.length;
      hasNext = !!nextTracks.body.next;
    }

    // convert tracks to Song objects
    const songs = await Promise.all(tracks.map((track) => getSong(track)));

    // create playlist in db
    const newPlaylist = await createPlaylist(playlistName, user);
    await updatePlaylistByID(
      newPlaylist._id,
      user,
      undefined,
      songs.map((song) => song._id)
    );

    return newPlaylist._id;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const spotifyAuthUrl = (state: string, type: string): string => {
  return spotifyApi.createAuthorizeURL(scopes, [state, type].join(","));
};
