import express from "express";
import { AuthRequest, auth } from "../util/auth";
import SpotifyWebApi from "spotify-web-api-node";
import { User } from "../models/user-model";

const router = express.Router();
const redirectUri = `${process.env.CLIENT_URL}/auth/spotify/callback`;

router.post("/spotify", auth, async (req: AuthRequest, res) => {
  res.send("spotify export");

  const spotifyApi = new SpotifyWebApi({
    redirectUri,
    clientId: process.env.SPOTIFY_CLIENT_ID || "",
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  });

  if (req.user) {
    spotifyApi.createPlaylist(req.user.name);
  }
  else {
    throw new Error("Error accesing user playlist");
  }

});

router.post("/deezer", auth, async (req: AuthRequest, res) => {
  res.send("deezer export");
});

export default router;
