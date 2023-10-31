import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div>
        <ul>
          <li>
            <Link to={"/playlists"}>Playlists Page</Link>
          </li>
          <li>
            <Link to={"/playlist"}>Playlist Page</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
