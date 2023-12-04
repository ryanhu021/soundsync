import React, { useEffect, useState } from "react";
import { CardGroup, Container } from "react-bootstrap";
import PlaylistCard from "../components/playlist-card";
import AddPlaylistCard from "../components/add-playlist-card";
import { useAuth } from "../auth/auth-provider";
import { BackLink } from "../components/back-link";
import FullScreenSpinner from "../components/full-screen-spinner";
import "../component-styles/playlists-styles.css";

export interface Playlist {
  _id: string;
  name: string;
  creator: string;
  creatorName: string;
  dateCreated: string;
  imageUrl: string;
  songs: string[];
}

export default function Playlists() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/playlist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 200) {
          const playlists = await res.json();
          setPlaylists(playlists);
        } else {
          setError("Error getting playlists");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Internal server error");
      });
  }, []);

  const deletePlaylist = (index: number) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      setLoading(true);
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/playlist/${playlists[index]._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )
        .then(async (res) => {
          if (res.status === 204) {
            //update the playlists state
            const updatedPlaylists = [...playlists];
            updatedPlaylists.splice(index, 1);
            setPlaylists(updatedPlaylists);
          } else {
            setError("Error deleting playlist");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Internal server error");
          setLoading(false);
        });
    }
  };

  if (loading) {
    return <FullScreenSpinner />;
  }

  return (
    <Container>
      <BackLink />
      <h1 className="page-title">{user.name}&apos;s Playlists</h1>
      <div className="playlists-container">
        <CardGroup className="playlists-card-group">
          <AddPlaylistCard />
          {playlists.map((playlist: Playlist, index: number) => (
            <PlaylistCard
              key={index}
              onDelete={() => deletePlaylist(index)}
              {...playlist}
            />
          ))}
        </CardGroup>
      </div>
      <p>{error}</p>
    </Container>
  );
}
