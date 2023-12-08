import React from "react";
import { Button } from "react-bootstrap";

type SpotifyExportProps = {
  playlistId: string;
};

export default function SpotifyExport(props: SpotifyExportProps) {
  const handleSubmit = () => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/oauth/spotify?state=${props.playlistId}?type=export`,
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

  return (
    <Button
      onClick={handleSubmit}
      style={{
        color: "#fff !important",
        border: "2px solid #4158d0",
        marginTop: "-10px",
        fontSize: "20px",
        fontWeight: "500",
        background: "linear-gradient(-135deg, #7a82c9, #bda0f3)",
        transition: "all 0.3s ease",
        marginBottom: "20px",
      }}
    >
      Export to Spotify
    </Button>
  );
}
