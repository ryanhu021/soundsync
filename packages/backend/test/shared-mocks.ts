import { Track } from "../src/services/spotify-services";
import { Song } from "../src/models/song-model";

export const MOCK_PLAYLIST_ID = "playlist123";
export const MOCK_USER = {
  _id: "user123",
  name: "John Doe",
  email: "johndoe@example.com",
  playlists: [],
  save: jest.fn(),
};
export const MOCK_NAME = "Old Playlist Name";
export const MOCK_SONGS = ["song123", "song456"];
export const MOCK_IMAGE_URL = "https://example.com/song/image.jpg";
export const MOCK_TITLE = "Song Name";
export const MOCK_ARTIST_NAME = "Artist Name";
export const MOCK_ALBUM_NAME = "Album Title";
export const MOCK_SPOTIFY_PROVIDER_URL = "https://open.spotify.com/track/123";
export const MOCK_DEEZER_PROVIDER_URL = "https://deezer.com/track/123";
export const MOCK_SPOTIFY_TRACK: Track | Song = {
  name: MOCK_TITLE,
  artist: MOCK_ARTIST_NAME,
  album: MOCK_ALBUM_NAME,
  providerUrl: MOCK_SPOTIFY_PROVIDER_URL,
  imageUrl: MOCK_IMAGE_URL,
};
export const MOCK_DEEZER_TRACK: Track | Song = {
  name: MOCK_TITLE,
  artist: MOCK_ARTIST_NAME,
  album: MOCK_ALBUM_NAME,
  providerUrl: MOCK_DEEZER_PROVIDER_URL,
  imageUrl: MOCK_IMAGE_URL,
};
export const MOCK_PLAYLIST = {
  _id: MOCK_PLAYLIST_ID,
  creator: MOCK_USER._id,
  name: MOCK_NAME,
  songs: MOCK_SONGS,
  imageUrl: MOCK_IMAGE_URL,
  save: jest.fn(),
  deleteOne: jest.fn(),
};
