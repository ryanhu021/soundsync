import React from "react";
import FullScreenSpinner from "../components/full-screen-spinner";
import { useAuth } from "../auth/auth-provider";
import { Container, Card, Button, CardText } from "react-bootstrap";
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
            <Card
              style={{
                display: "flex",
                background: "linear-gradient(-135deg, #8a6bc3, #5f6acf)",
                padding: "0.7rem",
                marginTop: "1.5rem",
                marginRight: "2rem",
              }}
            >
              <Container style={{ width: "40rem" }}>
                <Card.Body style={{ color: "white" }}>
                  <Card.Title style={{ textAlign: "center" }}>
                    Steps on how to add songs to your playlist:
                  </Card.Title>
                  <CardText>
                    <ol>
                      <li>
                        Obtain the spotify or deezer song link.
                        <ul>
                          <li>
                            For Spotify, right click on the song and select
                            &quot;Copy Song Link&quot;. Or use the song link in
                            the URL.
                            <br />
                            <img
                              src="spotifysong.png"
                              style={{ width: "29rem" }}
                            />
                          </li>
                          <br />
                          <li>
                            For Deezer, left click on the triple dots icon and
                            select share. Then select &quot;Copy&quot;.
                            <br />
                            <img
                              src="deezersong.png"
                              style={{ width: "29rem" }}
                            />
                          </li>
                        </ul>
                      </li>
                      <br />
                      <li>
                        Paste that link into the &quot;Add Songs&quot; section
                        to add the song into your SoundSync playlist.
                      </li>
                      <br />
                      <li>
                        Once your are satisfied with your playlist, go ahead and
                        click that export button to export your playlist to your
                        desired platform!
                      </li>
                    </ol>
                  </CardText>
                </Card.Body>
              </Container>
            </Card>
          </Container>
        </div>
      </header>
    </Container>
  );
}
