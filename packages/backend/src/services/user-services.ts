import bcrypt from "bcrypt";
import { User } from "../models/user-model";
import { generateToken } from "../util/auth";
import { serialize } from "cookie";

const JWT_EXPIRE = 60 * 60 * 24;

const serializeToken = (token: string, maxAge = JWT_EXPIRE) =>
  serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<string> => {
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
  return serializeToken(await generateToken({ _id: user._id }));
};

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    return Promise.reject("Invalid email or password");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return Promise.reject("Invalid email or password");
  }
  return serializeToken(await generateToken({ _id: user._id }));
};

export const logout = async (): Promise<string> =>
  Promise.resolve(serializeToken("", 0));
