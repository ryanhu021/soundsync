import express from "express";
import { deezerUrlSearch } from "../services/deezer-services";

const router = express.Router();

router.post("/url", async (req, res) => {
  deezerUrlSearch(req.body.url)
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send({ error }));
});

export default router;
