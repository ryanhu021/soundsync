import express from "express";
import { AuthRequest, auth } from "../util/auth";
import { spotifyExport } from "../services/spotify-services";

const router = express.Router();
const redirectUri = `${process.env.CLIENT_URL}/auth/spotify/callback`;

router.post("/spotify", auth, async (req: AuthRequest) => {
  spotifyExport(req.user!, req.body.token, req.body.playlistId);
  // .then(redirectUri)
  // .catch((err: Error) => {
  //   console.log(err);
  // });
});

router.post("/deezer", auth, async (req: AuthRequest, res) => {
  res.send("deezer export");
});

export default router;
