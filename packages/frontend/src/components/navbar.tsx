import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/auth-provider";

function SSNavbar() {
  const { user } = useAuth();

  const logout = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => res.status === 200 && (window.location.href = "/"))
      .catch((err) => console.log(err));
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className="justify-content-between"
    >
      <Link to="/">
        <Navbar.Brand>
          <img src="sslogo.png" width={85} height={85}></img>
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>
      <Navbar.Collapse
        id="responsive-navbar-nav"
        className="justify-content-end"
      >
        <Nav>
          <Link to="/playlists">
            <Button>View Playlists</Button>
          </Link>
          <Link to="/playlists/create">
            <Button>Create Playlists</Button>
          </Link>
          {user.name ? (
            <Button onClick={logout}>Log out</Button>
          ) : (
            <>
              <Link to="/login">
                <Button>Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default SSNavbar;
