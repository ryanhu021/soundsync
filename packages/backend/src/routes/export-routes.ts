import express from "express";
import { AuthRequest, auth } from "../util/auth";

const router = express.Router();

router.post("/spotify", auth, async (req: AuthRequest, res) => {
  res.send("spotify export");
});

router.post("/deezer", auth, async (req: AuthRequest, res) => {
  res.send("deezer export");
});

export default router;
