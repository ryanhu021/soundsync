import { Document, Schema, model } from "mongoose";

export interface Song extends Document {
  name: string;
  artist: string;
  album: string;
  providerUrl: string;
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
    providerUrl: {
      type: String,
      required: false,
    },
  },
  { collection: "songs" }
);

export const Song = model<Song>("Song", SongSchema);
