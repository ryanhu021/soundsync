import React from "react";
import { Button } from "react-bootstrap";

type DeezerExportProps = {
  playlistId: string;
};
export default function DeezerExport(props: DeezerExportProps) {
  const handleSubmit = () => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/oauth/deezer?playlistId=${props.playlistId}`,
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

  return <Button onClick={handleSubmit}>Export to Deezer</Button>;
}
