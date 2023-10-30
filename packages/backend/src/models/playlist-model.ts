import { Document, Schema, model, Types } from "mongoose";

export interface Playlist extends Document {
  name: string;
  creator: Types.ObjectId;
  dateCreated: Date;
  songs: [string];
}

const PlaylistSchema = new Schema<Playlist>(
  {
    name: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dateCreated: Date.now(),
    songs: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { collection: "playlists" }
);

export const Playlist = model<Playlist>("Playlist", PlaylistSchema);
