import { Document, Schema, model } from "mongoose";

export interface Song extends Document {
  name: string;
  artist: string;
  album: string;
  spotifyId: string;
  soundCloudId: string;
}

const SongSchema = new Schema<Song>(
  {
    name: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: true,
    },
    spotifyId: {
      type: String,
      required: false,
    },
    soundCloudId: {
      type: String,
      required: false,
    },
  },
  { collection: "songs" }
);

export const Song = model<Song>("Song", SongSchema);
