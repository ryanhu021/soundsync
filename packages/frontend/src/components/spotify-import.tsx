import React from "react";
import { Button } from "react-bootstrap";

type SpotifyImportProps = {
  getPlaylistUrl: () => string;
};

export default function SpotifyImport(props: SpotifyImportProps) {
  const handleSubmit = () => {
    if (props.getPlaylistUrl()) {
      const playlistUrl = new URL(props.getPlaylistUrl());
      const playlistUrlNoParams = playlistUrl.origin + playlistUrl.pathname;
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/oauth/spotify?state=${playlistUrlNoParams}&type=import`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.url) {
            window.location.href = res.url;
          }
        });
    }
  };

  return (
    <Button className="rounded-pill" onClick={handleSubmit}>
      Import from Spotify
    </Button>
  );
}
