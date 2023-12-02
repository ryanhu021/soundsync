import React from "react";
import { Button } from "react-bootstrap";

type SpotifyExportProps = {
  playlistId: string;
};

export default function SpotifyExport(props: SpotifyExportProps) {
  const handleSubmit = () => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/oauth/spotify?playlistId=${props.playlistId}`,
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
  };

  return <Button onClick={handleSubmit}>Export to Spotify</Button>;
}
