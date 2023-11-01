import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";

interface UserToken {
  id: string;
}

type UserContext = Omit<User, "password">;

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
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).send({ error: "JWT secret not set" });
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!(decoded as UserToken).id) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const user = await User.findById(
      (decoded as UserToken).id,
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
