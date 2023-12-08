import React from "react";
import { Button } from "react-bootstrap";

type SpotifyImportProps = {
  getPlaylistUrl: () => string;
};

export default function SpotifyImport(props: SpotifyImportProps) {
  const handleSubmit = () => {
    if (props.getPlaylistUrl()) {
      fetch(
        `${
          process.env.REACT_APP_SERVER_URL
        }/oauth/spotify?state=${props.getPlaylistUrl()}&type=import`,
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
    <Button className="field-create-playlist" onClick={handleSubmit}>
      Import from Spotify
    </Button>
  );
}
