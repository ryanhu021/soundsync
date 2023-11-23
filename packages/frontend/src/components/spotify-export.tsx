import React from "react";
import { Button } from "react-bootstrap";

// const scopes = ["playlist-modify-public", "playlist-modify-private"];
// const redirectUri = "http://localhost:3000";
// const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
// const state = "spotify_auth_state";
// const showDialog = true;

// const spotifyApi = new SpotifyWebApi({
//   clientId: clientId,
//   redirectUri: redirectUri,
// });

export default function SpotifyExport() {
  const handleSubmit = () => {
    fetch("http://localhost:8000/song/auth/spotify", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.url) {
          window.location.href = res.url;
        }
      });
  };

  return <Button onClick={handleSubmit}>Export to Spotify</Button>;
}
