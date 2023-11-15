import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

// import { useCookies } from "react-cookie";
import SearchBar from "../components/searchbar";

export default function Playlist() {
  // const [cookies] = useCookies(["user", "token"]);

  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = () => {
    console.log(playlistName);
    setPlaylistName("");
  };
  return (
    <div>
      <Form>
        <header>
          <h1>Create Playlist</h1>
          <Container>
            <h3>Name Playlist</h3>
            <Form>
              <Form.Control
                type="text"
                value={playlistName}
                onChange={(event) => setPlaylistName(event.target.value)}
                placeholder="Enter Playlist Name"
                aria-describedby="submit"
              />
            </Form>
            <Button onClick={handleSubmit}>Submit</Button>
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
      </Form>
    </div>
  );
}
