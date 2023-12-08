import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import SearchBar from "../components/search-bar";
import SongCard from "../components/song-card";
import SpotifyExport from "../components/spotify-export";
import { useAuth } from "../auth/auth-provider";
import { Playlist } from "./playlists";
import { useParams, useSearchParams } from "react-router-dom";
import { BackLink } from "../components/back-link";
import FullScreenSpinner from "../components/full-screen-spinner";
import DeezerExport from "../components/deezer-export";
import "../component-styles/view-playlist.css";

export interface Song {
  _id: string;
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
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const exported = searchParams.get("exported");
  const url = searchParams.get("url");
  const count = searchParams.get("count");
  const exportError = searchParams.get("error");
  const { register, handleSubmit } = useForm<Inputs>();
  const [playlist, setPlaylist] = useState<Playlist>({
    _id: "",
    name: "",
    creator: "",
    creatorName: "",
    dateCreated: "",
    imageUrl: "",
    songs: [],
  });
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getSongs = async (id: string) => {
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/song/all/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res && res.status === 200) {
      return await res.json();
    } else {
      setError("Error getting songs");
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/playlist/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          const playlist = await res.json();
          setSongs(await getSongs(playlist._id));
          setPlaylist(playlist);
        } else {
          setError("Error getting playlist");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Internal server error");
        setLoading(false);
      });
  }, []);

  const addSong = (song: Song) => {
    setLoading(true);
    const updatedSongs = [...songs, song];
    fetch(`${process.env.REACT_APP_SERVER_URL}/playlist/${playlist._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ songs: updatedSongs }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          const updated = await res.json();
          setSongs(await getSongs(updated.songs));
          setPlaylist(updated);
        } else {
          setError("Error adding song");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Internal server error");
        setLoading(false);
      });
  };

  const deleteSong = (index: number) => {
    setLoading(true);
    const updatedSongs = [...songs];
    updatedSongs.splice(index, 1);
    fetch(`${process.env.REACT_APP_SERVER_URL}/playlist/${playlist._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ songs: updatedSongs }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          const updated = await res.json();
          setPlaylist(updated);
          setSongs(await getSongs(updated.songs));
        } else {
          setError("Error deleting song");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Internal server error");
        setLoading(false);
      });
  };

  const rename: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_SERVER_URL}/playlist/${playlist._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name: data.name }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          const updated = await res.json();
          setPlaylist(updated);
        } else {
          setError("Error renaming playlist");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Internal server error");
        setLoading(false);
      });
  };

  const getExportAlert = (): JSX.Element => {
    if (exported) {
      if (exportError) {
        return (
          <Alert variant="danger" dismissible>
            Error exporting playlist to {exported}. Please try again.
          </Alert>
        );
      }
      // with url
      if (url) {
        return (
          <Alert variant="success" dismissible>
            Successfully exported {count} songs to {exported}:{" "}
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </Alert>
        );
      }
    }
    return <></>;
  };

  if (loading) {
    return <FullScreenSpinner />;
  }

  return (
    <Container>
      <div className="wrapper">
        <BackLink to="/playlists" />
        {getExportAlert()}
        <h1 className="title">{playlist.name}</h1>
        {playlist.creatorName === user.name && (
          <Form
            className="d-flex"
            onSubmit={handleSubmit(rename)}
            style={{ paddingBottom: "10px" }}
          >
            <Form.Control
              type="name"
              className="me-2 rounded-pill"
              defaultValue={playlist.name}
              {...register("name")}
              placeholder="Enter Playlist Name"
              aria-describedby="submit"
            />
            <Button
              type="submit"
              className="rounded-pill"
              style={{
                color: "#fff !important",
                border: "2px solid #4158d0",
                fontSize: "20px",
                fontWeight: "500",
                background: "linear-gradient(-135deg, #7a82c9, #bda0f3)",
                transition: "all 0.3s ease",
              }}
            >
              Rename
            </Button>
          </Form>
        )}
        <div className="d-flex flex-column justify-content-center">
          <strong className="name">By: {playlist.creatorName}</strong>
          <p className="date">
            {songs.length} songs, created{" "}
            {new Date(playlist.dateCreated).toLocaleDateString()}
          </p>
        </div>
        <div className="d-flex justify-content-around">
          <SpotifyExport playlistId={playlist._id} />
          <DeezerExport playlistId={playlist._id} />
        </div>
      </div>
      {playlist.creatorName === user.name && (
        <div className="wrapper">
          <h3 className="subtitle">Add Songs</h3>
          <SearchBar onSongFetched={addSong} />
        </div>
      )}
      <div className="wrapper">
        <h4 className="subtitle">Songs</h4>
        {songs.map((song: Song, index: number) => (
          <SongCard key={index} onDelete={() => deleteSong(index)} {...song} />
        ))}
      </div>
      <p>{error}</p>
    </Container>
  );
}
