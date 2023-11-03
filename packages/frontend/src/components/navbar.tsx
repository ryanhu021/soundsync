import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

//<img> src={`${process.env.PUBLIC_URL}/images/sslogo.png`} </img>
//<img> src={"/packages/frontend/public/sslogo.png"}</img>

function SSNavbar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link to="/">
          <Navbar.Brand>
            <img src="/packages/frontend/public/sslogo.png"></img>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link>
              <Link to="/playlists">
                <Button>View Playlists</Button>
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SSNavbar;
