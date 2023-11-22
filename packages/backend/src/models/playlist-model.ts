import { Document, Schema, model, Types } from "mongoose";

export interface Playlist extends Document {
  name: string;
  creator: Types.ObjectId;
  dateCreated: Date;
  imageUrl: string;
  songs: [Types.ObjectId];
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
    dateCreated: { type: Date, default: Date.now() },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { collection: "playlists" }
);

export const Playlist = model<Playlist>("Playlist", PlaylistSchema);
