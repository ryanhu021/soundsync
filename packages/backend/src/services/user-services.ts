import bcrypt from "bcrypt";
import { User } from "../models/user-model";
import { generateToken } from "../util/auth";
import { UserContext } from "../util/auth";

export interface LoginResult {
  token: string;
  user: UserContext;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  const user = await User.findOne({ email });
  if (!user) {
    return Promise.reject("User not found");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return Promise.reject("Invalid password");
  }
  return {
    token: await generateToken({ _id: user._id }),
    user: { _id: user._id, name: user.name, email: user.email },
  };
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<LoginResult> => {
  if ((await User.find({ email })).length > 0) {
    return Promise.reject("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await new User({
    name,
    email,
    password: hashedPassword,
    playlists: [],
  }).save();
  return {
    token: await generateToken({ _id: user._id }),
    user: { _id: user._id, name: user.name, email: user.email },
  };
};
