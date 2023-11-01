import bcrypt from "bcrypt";
import { User } from "../models/user-model";
import { generateToken } from "../util/auth";

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  if ((await User.find({ email })).length > 0) {
    Promise.reject("User already exists");
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

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    return Promise.reject("User not found");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return Promise.reject("Invalid password");
  }
  return generateToken({ id: user._id });
};
