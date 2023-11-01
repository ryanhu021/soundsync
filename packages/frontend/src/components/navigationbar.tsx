import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

function NavigationBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">SoundSync</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/playlists">
            <Button>View Playlists</Button>
          </Nav.Link>
          <Nav.Link href="/playlist">
            <Button>New Playlists</Button>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
