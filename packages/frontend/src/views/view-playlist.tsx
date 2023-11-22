import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import SearchBar from "../components/searchbar";
import SongCard from "../components/song-card";
import SpotifyExport from "../components/spotify-export";
import { useAuth } from "../auth/auth-provider";

interface Song {
  name: string;
  artist: string;
  album: string;
  providerUrl: string;
  imageUrl: string;
}

type Inputs = {
  name: string;
};

export default function ViewPlaylist() {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm<Inputs>();
  const [playlistName, setPlaylistName] = useState("New Playlist");

  //Replace with playlist songs from the database
  const [songs, setSongs] = useState([
    {
      name: "1",
      artist: "me",
      album: "SOS",
      providerUrl:
        "https://open.spotify.com/track/2V9AMx6KfrGcfBMjuPhP6u?si=a17b64e6a6d9499d",
      imageUrl: "https://api.deezer.com/album/302127/image",
    },
    {
      name: "2",
      artist: "me",
      album: "SOS",
      providerUrl:
        "https://open.spotify.com/track/2V9AMx6KfrGcfBMjuPhP6u?si=a17b64e6a6d9499d",
      imageUrl: "https://api.deezer.com/album/93341322/image",
    },
    {
      name: "3",
      artist: "me",
      album: "SOS",
      providerUrl:
        "https://open.spotify.com/track/2V9AMx6KfrGcfBMjuPhP6u?si=a17b64e6a6d9499d",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273ae936137924268701ee507b4",
    },
  ]);

  const deleteSong = (index: number) => {
    //fetch request for removing song from playlist goes in here

    //update the playlist state
    const updatedSongs = [...songs];
    updatedSongs.splice(index, 1);
    setSongs(updatedSongs);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setPlaylistName(data.name);
  };

  return (
    <Container>
      <h1>{playlistName}</h1>
      {user.name && (
        <Form className="d-flex" onSubmit={handleSubmit(onSubmit)}>
          <Form.Control
            type="name"
            className="me-2 rounded-pill"
            defaultValue={playlistName}
            {...register("name")}
            placeholder="Enter Playlist Name"
            aria-describedby="submit"
          />
          <Button
            type="submit"
            className="rounded-pill"
            variant="outline-primary"
          >
            Update
          </Button>
        </Form>
      )}
      <p>By Creator name</p>
      <SpotifyExport />
      {user.name && (
        <div>
          <h3>Add Songs</h3>
          <SearchBar />
        </div>
      )}
      <div>
        <h4>Songs</h4>
        {songs.map((song: Song, index: number) => (
          <SongCard
            key={index}
            name={song.name}
            album={song.album}
            artist={song.artist}
            imageURL={song.imageUrl}
            songURL={song.providerUrl}
            onDelete={() => deleteSong(index)}
          />
        ))}
      </div>
    </Container>
  );
}
