import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../auth/auth-provider";
import SpotifyExport from "../components/spotify-export";

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <header>
        <h1>Home</h1>
        <h2>Welcome to SoundSync, {user.name ? user.name : "Guest"}!</h2>
        <p>Your most convenient playlist manager!</p>
        <div>
          <Link to="/playlists/create">
            <Button>Create A New Playlist</Button>
          </Link>
          <Link to="/playlists">
            <Button>View Playlists</Button>
          </Link>
        </div>
      </header>
      <footer>
        <p>
          © SoundSync 2023 | A cross platform playlist manager | All rights
          reserved
        </p>
      </footer>
    </div>
  );
}
