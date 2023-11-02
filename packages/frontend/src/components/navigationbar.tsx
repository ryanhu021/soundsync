import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function NavigationBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Link to="/">
          <Navbar.Brand>SoundSync</Navbar.Brand>
        </Link>
        <Nav className="mr-auto">
          <Nav.Link>
            <Link to="/playlists">
              <Button>View Playlists</Button>
            </Link>
          </Nav.Link>
          <Nav.Link href="/playlist">
            <Link to="/playlist">
              <Button>New Playlist</Button>
            </Link>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
