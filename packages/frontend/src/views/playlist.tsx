import React from "react";
import { Container } from "react-bootstrap";
// import { useCookies } from "react-cookie";
import SearchBar from "../components/searchbar";

export default function Playlist() {
  // const [cookies] = useCookies(["user", "token"]);

  return (
    <div>
      <header>
        <h1>Create Playlist</h1>
        <Container>
          <h3>Name Playlist</h3>
          <h3>Add Songs</h3>
          <h3>Export</h3>
        </Container>
      </header>
      <body>
        <Container>
          <h4>Songs</h4>
          {/* {cookies.user.username} */}
        </Container>
      </body>
      <SearchBar />
    </div>
  );
}
