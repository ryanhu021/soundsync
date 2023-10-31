import React from "react";
import { Link } from "react-router-dom";

export default function Playlist() {
  return (
    <>
      <div>Playlist Page</div>
      <Link to={"/"}>Home</Link>
      <Link to={"/playlists"}>Playlists</Link>
    </>
  );
}
