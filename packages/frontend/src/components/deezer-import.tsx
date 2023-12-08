import React from "react";
import { Button } from "react-bootstrap";

type DeezerImportProps = {
  getPlaylistUrl: () => string;
};

export default function DeezerImport(props: DeezerImportProps) {
  const handleSubmit = () => {
    console.log(props.getPlaylistUrl());
    if (props.getPlaylistUrl()) {
      fetch(
        `${
          process.env.REACT_APP_SERVER_URL
        }/oauth/deezer?state=${props.getPlaylistUrl()}&type=import`,
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
      Import from Deezer
    </Button>
  );
}
