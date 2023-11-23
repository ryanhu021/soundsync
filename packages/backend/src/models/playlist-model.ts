import { Document, Schema, model, Types } from "mongoose";

export interface Playlist extends Document {
  name: string;
  creator: Types.ObjectId;
  creatorName: string;
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
    creatorName: {
      type: String,
      required: true,
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
      required: false,
    },
  },
  { collection: "playlists" }
);

export const Playlist = model<Playlist>("Playlist", PlaylistSchema);
