import express from "express";
import { AuthRequest, auth } from "../util/auth";
// import { deezerImport } from "../services/deezer-services";
import { spotifyImport } from "../services/spotify-services";

const router = express.Router();

router.post("/spotify", auth, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).send({ error: "Unauthorized" });

  spotifyImport(req.user, req.body.token, req.body.playlistUrl)
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send({ error }));
});

// router.post("/deezer", auth, async (req: AuthRequest, res) => {
//   if (!req.user) return res.status(401).send({ error: "Unauthorized" });
//
//   deezerImport(req.user, req.body.token, req.body.playlistUrl)
//   .then((result) => res.status(200).send(result))
//   .catch((error) => res.status(500).send({ error }));or }));
// });

export default router;
