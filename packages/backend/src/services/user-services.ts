import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";

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
  if (!process.env.JWT_SECRET) {
    return Promise.reject("JWT secret not set");
  }
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};
