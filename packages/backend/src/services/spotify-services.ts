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

export const spotifyExport = async (
  user: UserContext,
  token: string,
  playlistId: string
): Promise<ExportResult> => {
  // authorize user
  const authResult = await spotifyApi.authorizationCodeGrant(token);
  if (authResult.statusCode !== 200) {
    return Promise.reject("Authorization failed");
  }
  spotifyApi.setAccessToken(authResult.body.access_token);

  // fetch playlist from database
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return Promise.reject("Playlist not found");
  }

  // fetch tracks from playlist
  const trackUris = (
    await Promise.all(
      playlist.songs.map((songId) =>
        Song.findById(songId).then((song) => song && getTrackUriFromSong(song))
      )
    )
  ).filter((trackId: string | null) => trackId !== null) as string[];

  // create new playlist
  const createPlaylistResponse = await spotifyApi.createPlaylist(
    playlist.name,
    {
      description: `Created by SoundSync: ${process.env.CLIENT_URL}`,
    }
  );
  if (createPlaylistResponse.statusCode !== 201) {
    return Promise.reject("Failed to create playlist");
  }

  // add tracks to playlist
  const addTracksResponse = await spotifyApi.addTracksToPlaylist(
    createPlaylistResponse.body.id,
    trackUris
  );
  if (addTracksResponse.statusCode !== 201) {
    return Promise.reject("Failed to add tracks to playlist");
  }

  // return result
  return {
    url: createPlaylistResponse.body.external_urls.spotify,
    count: trackUris.length,
  };
};

export const spotifyAuthUrl = (state: string): string => {
  return spotifyApi.createAuthorizeURL(scopes, state);
};
