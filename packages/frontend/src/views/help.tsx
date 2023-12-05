import React from "react";
import FullScreenSpinner from "../components/full-screen-spinner";
import { useAuth } from "../auth/auth-provider";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Help() {
  const { loading } = useAuth();

  if (loading) {
    return <FullScreenSpinner />;
  }

  return (
    <Container style={{ color: "#8a6bc3" }}>
      <header>
        <h2
          style={{
            font: "Times",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "3.5em",
            paddingTop: "3rem",
          }}
        >
          Help Page
        </h2>
        <div
          style={{
            font: "Times",
            textAlign: "center",
            fontSize: "1.5em",
            padding: "1rem",
          }}
        >
          Your most convenient playlist manager
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Container style={{ color: "#8a6bc3", paddingBottom: "8rem" }}>
            <Card
              style={{
                display: "flex",
                background: "linear-gradient(-135deg, #8a6bc3, #5f6acf)",
                padding: "0.7rem",
                textAlign: "center",
                backgroundSize: "27rem",
                marginTop: "1.5rem",
                marginRight: "2rem",
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  New to SoundSync? Sign up!
                </Card.Title>
                <Link to="/signup">
                  <Button
                    style={{
                      backgroundColor: "#8a6bc3",
                      color: "white",
                      borderColor: "white",
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </Card.Body>
            </Card>
            <Card
              style={{
                display: "flex",
                background: "linear-gradient(-135deg, #8a6bc3, #5f6acf)",
                padding: "0.7rem",
                textAlign: "center",
                backgroundSize: "27rem",
                marginTop: "1.5rem",
                marginRight: "2rem",
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  Already have an account? Lets get the party started!
                </Card.Title>
                <Link to="/playlists/create">
                  <Button
                    style={{
                      backgroundColor: "#8a6bc3",
                      color: "white",
                      borderColor: "white",
                    }}
                  >
                    Create A New Playlist
                  </Button>
                </Link>
              </Card.Body>
            </Card>
            <Card
              style={{
                display: "flex",
                background: "linear-gradient(-135deg, #8a6bc3, #5f6acf)",
                padding: "0.7rem",
                textAlign: "center",
                backgroundSize: "27rem",
                marginTop: "1.5rem",
                marginRight: "2rem",
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  Want to see the awesome playlists you&apos;ve made?
                </Card.Title>
                <Link to="/playlists">
                  <Button
                    style={{
                      backgroundColor: "#8a6bc3",
                      color: "white",
                      borderColor: "white",
                    }}
                  >
                    View Playlists
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Container>
        </div>
      </header>
    </Container>
  );
}
