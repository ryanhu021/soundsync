import express from "express";
import { Playlist } from "../models/playlist-model";

const router = express.Router();

// Get all playlists
router.get("/playlists", async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.json(playlists);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Get a specific playlist by id
router.get("/playlists/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).send({ message: "Playlist not found" });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Create a new playlist
router.post("/playlists", async (req, res) => {
  try {
    const { name, creator, songs, imageUrl } = req.body;
    const playlist = new Playlist({ name, creator, songs, imageUrl });
    const newPlaylist = await playlist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Update a playlist by ID
router.put("/playlists/:id", async (req, res) => {
  try {
    const { name, creator, songs, imageUrl } = req.body;
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { name, creator, songs, imageUrl },
      { new: true }
    );
    if (!updatedPlaylist) {
      return res.status(404).send({ message: "Playlist not found" });
    }
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Delete a playlist by ID
router.delete("/playlists/:id", async (req, res) => {
  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
    if (!deletedPlaylist) {
      return res.status(404).send({ message: "Playlist not found" });
    }
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

export default router;
