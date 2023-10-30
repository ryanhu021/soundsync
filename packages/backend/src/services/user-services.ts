import bcrypt from "bcrypt";
import { User } from "../models/user-model";

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  if ((await User.find({ email })).length > 0) {
    return Promise.reject("Email already exists.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    playlists: [],
  });
  return await user.save();
};
