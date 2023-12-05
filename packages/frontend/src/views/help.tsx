import React from "react";
import FullScreenSpinner from "../components/full-screen-spinner";
import { useAuth } from "../auth/auth-provider";
import { Container, Row, Card, Button } from "react-bootstrap";
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
