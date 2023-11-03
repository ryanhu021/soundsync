import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function Home() {
  const [cookies] = useCookies(["user", "token"]);

  return (
    <div>
      <header>
        <h1>Home</h1>
        <h2>Welcome to SoundSync</h2>
        <p>Your most convenient playlist manager!</p>
        {cookies.user && cookies.token && (
          <>
            <h2>Welcome {cookies.user.name}</h2>
            <p>{cookies.user.email}</p>
            <p>{cookies.token}</p>
          </>
        )}
        <div>
          <Link to="/playlist">
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
