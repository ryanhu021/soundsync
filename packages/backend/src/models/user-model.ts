import { Document, Schema, model, Types } from "mongoose";
import validator from "validator";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  playlists: [Types.ObjectId];
}

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: true,
    },
    playlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
  },
  { collection: "users" }
);

export const User = model<User>("User", UserSchema);
