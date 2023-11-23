import React from "react";
import { Button } from "react-bootstrap";

export default function SpotifyExport() {
  const handleSubmit = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/song/auth/spotify`, {
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
