import express from "express";
import { Playlist } from "../models/playlist-model";
import { AuthRequest, auth } from "../util/auth";
import { User } from "../models/user-model";
import { Song } from "../models/song-model";

const router = express.Router();

// Get all playlists for user
router.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const playlists = await Playlist.find({ creator: req.user?._id });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Get a specific playlist by id
router.get("/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).send({ error: "Playlist not found" });
    }
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Create a new playlist
router.post("/", auth, async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;
    const creator = req.user?._id;
    const creatorName = req.user?.name;

    // create playlist
    const playlist = new Playlist({
      name,
      creator,
      creatorName,
      songs: [],
    });
    const newPlaylist = await playlist.save();

    // add playlist to user
    const user = await User.findById(creator);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    user.playlists.push(newPlaylist._id);
    await user.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Update a playlist by ID
router.put("/:id", auth, async (req: AuthRequest, res) => {
  try {
    const { name, songs } = req.body;

    // get first song for image url
    const firstSong = await Song.findOne({ _id: songs[0] });
    if (!firstSong) {
      return res.status(404).send({ error: "Error updating playlist" });
    }

    // update playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { name, songs, imageUrl: firstSong.imageUrl },
      { new: true }
    );
    if (!updatedPlaylist) {
      return res.status(404).send({ error: "Playlist not found" });
    }
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Delete a playlist by ID
router.delete("/:id", auth, async (req: AuthRequest, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).send({ error: "Playlist not found" });
    }
    if (playlist.creator.toString() !== req.user?._id.toString()) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    await playlist.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error });
  }
});

export default router;
