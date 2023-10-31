import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Playlist() {
  return (
    <>
      <div>Playlist Page</div>
      <Link to={"/"}>Home</Link>
      <Link to={"/playlists"}>Playlists</Link>
    </>
  );
}
