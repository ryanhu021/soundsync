import express from "express";
import { AuthRequest, auth } from "../util/auth";
import { deezerExport } from "../services/deezer-services";
import { spotifyExport } from "../services/spotify-services";

const router = express.Router();

router.post("/spotify", auth, async (req: AuthRequest, res) => {
  spotifyExport(req.body.token, req.body.playlistId)
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send({ error }));
});

router.post("/deezer", auth, async (req: AuthRequest, res) => {
  deezerExport(req.body.token, req.body.playlistId)
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send({ error }));
});

export default router;
