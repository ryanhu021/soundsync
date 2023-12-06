import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Card, Row } from "react-bootstrap";
import { useAuth } from "../auth/auth-provider";
import FullScreenSpinner from "../components/full-screen-spinner";

export default function Home() {
  const { user, loading } = useAuth();

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
          Welcome to SoundSync{user.name ? `, ${user.name}` : ""}!
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
        <div>
          <Row style={{ justifyContent: "center" }}>
            <Card
              style={{
                width: "36rem",
                height: "15rem",
                background: "lightblue",
                padding: "0.7rem",
                textAlign: "center",
                backgroundImage: `url("dance.png")`,
                backgroundSize: "27rem",
                marginTop: "1.5rem",
                marginRight: "2rem",
                border: "none",
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  Let your imaginations flow onto the DJ board!
                </Card.Title>
                <Link to="/playlists/create">
                  <Button
                    style={{ backgroundColor: "#5f6acf", color: "white" }}
                  >
                    Create A New Playlist
                  </Button>
                </Link>
              </Card.Body>
            </Card>
            <Card
              style={{
                width: "36rem",
                height: "15rem",
                background: "lightblue",
                padding: "0.7rem",
                textAlign: "center",
                backgroundImage: `url("vinyl.png")`,
                backgroundSize: "37rem",
                marginTop: "1.5rem",
                border: "none",
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  View your playlists
                </Card.Title>
                <Link to="/playlists">
                  <Button
                    style={{ backgroundColor: "#5f6acf", color: "white" }}
                  >
                    My Playlists
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Row>
        </div>
      </header>
    </Container>
  );
}
