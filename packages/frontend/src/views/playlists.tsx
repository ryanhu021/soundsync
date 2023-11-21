import React, { useState } from "react";
import { CardGroup, Container } from "react-bootstrap";
import PlaylistCard from "../components/playlist-card";
import AddPlaylistCard from "../components/add-playlist-card";
import { useAuth } from "../auth/auth-provider";

interface Playlist {
  name: string;
  creator: string;
  dateCreated: string;
  imageURL: string;
}

export default function Playlists() {
  const { user } = useAuth();

  //Replace with user playlists from the database
  const [playlists, setPlaylists] = useState([
    {
      name: "1",
      creator: "me",
      dateCreated: "",
      imageURL:
        "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
    },
    {
      name: "2",
      creator: "me",
      dateCreated: "",
      imageURL:
        "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
    },
    {
      name: "3",
      creator: "me",
      dateCreated: "",
      imageURL:
        "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
    },
    {
      name: "4",
      creator: "me",
      dateCreated: "",
      imageURL:
        "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
    },
    {
      name: "5",
      creator: "me",
      dateCreated: "",
      imageURL:
        "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
    },
    {
      name: "6",
      creator: "me",
      dateCreated: "",
      imageURL:
        "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
    },
    {
      name: "7",
      creator: "me",
      dateCreated: "",
      imageURL:
        "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
    },
  ]);

  const deletePlaylist = (index: number) => {
    const updatedSongs = [...playlists];
    updatedSongs.splice(index, 1);
    setPlaylists(updatedSongs);
  };

  return (
    <Container>
      <h1 style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        {user.name}&apos;s Playlists
      </h1>
      <div
        style={{
          justifyContent: "center",
        }}
      >
        <CardGroup
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <AddPlaylistCard />
          {playlists.map((playlist: Playlist, index: number) => (
            <PlaylistCard
              key={index}
              name={playlist.name}
              creator={playlist.creator}
              dateCreated={playlist.dateCreated}
              imageURL={playlist.imageURL}
              onDelete={() => deletePlaylist(index)}
            />
          ))}
        </CardGroup>
      </div>
    </Container>
  );
}
