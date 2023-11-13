import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";

type UserToken = {
  _id: string;
};

export type UserContext = {
  _id: string;
  name: string;
  email: string;
};

export interface AuthRequest extends Request {
  user?: UserContext;
}

export const generateToken = async (user: UserToken): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    return Promise.reject("JWT secret not set");
  }
  return Promise.resolve(
    jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" })
  );
};

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies || !req.cookies.token) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).send({ error: "JWT secret not set" });
  }
  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    if (!(decoded as UserToken)._id) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const user = await User.findById(
      (decoded as UserToken)._id,
      "-password -__v"
    );
    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ error: "Unauthorized" });
  }
};
