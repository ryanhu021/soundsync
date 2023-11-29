import express from "express";
import { AuthRequest, auth } from "../util/auth";
import {
  updatePlaylistByID,
  deletePlaylistByID,
  getAllPlaylists,
  getPlaylistByID,
  createPlaylist,
} from "../services/playlist-services";

const router = express.Router();

// Get all playlists for user
router.get("/", auth, async (req: AuthRequest, res) => {
  await getAllPlaylists(req.user)
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(error.status).send(error.message));
});

// Get a specific playlist by id
router.get("/:id", async (req, res) => {
  await getPlaylistByID(req.params.id)
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(error.status).send(error.message));
});

// Create a new playlist
router.post("/", auth, async (req: AuthRequest, res) => {
  await createPlaylist(req.body.name, req.user)
    .then((result) => res.status(201).json(result))
    .catch((error) => res.status(error.status).send(error.message));
});

// Update a playlist by ID
router.put("/:id", auth, async (req: AuthRequest, res) => {
  await updatePlaylistByID(
    req.params.id,
    req.user,
    req.body.name,
    req.body.songs
  )
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(error.status).send(error.message));
});

// Delete a playlist by ID
router.delete("/:id", auth, async (req: AuthRequest, res) => {
  await deletePlaylistByID(req.params.id, req.user)
    .then(() => res.status(204).send())
    .catch((error) => res.status(error.status).send(error.message));
});

export default router;
