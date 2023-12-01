import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Card, Row } from "react-bootstrap";
import { useAuth } from "../auth/auth-provider";

export default function Home() {
  const { user } = useAuth();

  return (
    <Container style={{ color: "purple" }}>
      <header>
        <h2
          style={{
            font: "Times",
            fontWeight: "bold",
            textAlign: "center",
            scale: "1.3",
            paddingTop: "3rem",
          }}
        >
          Welcome to SoundSync{user.name ? `, ${user.name}` : ""}!
        </h2>
        <div
          style={{
            font: "Times",
            textAlign: "center",
            scale: "1.5",
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
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  Let your imaginations flow onto the DJ board!
                </Card.Title>
                <Link to="/playlists/create">
                  <Button>Create A New Playlist</Button>
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
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: "white" }}>
                  View your playlists
                </Card.Title>
                <Link to="/playlists">
                  <Button>My Playlists</Button>
                </Link>
              </Card.Body>
            </Card>
          </Row>
        </div>
      </header>
    </Container>
  );
}
