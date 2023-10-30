import { Document, Schema, model } from "mongoose";

export interface Song extends Document {
  spotifyId: string;
  soundCloudId: string;
}

const SongSchema = new Schema<Song>(
  {
    spotifyId: {
      type: String,
      required: false,
    },
    soundCloudId: {
      type: String,
      required: false,
    },
  },
  { collection: "song" }
);

export const Song = model<Song>("Song", SongSchema);
