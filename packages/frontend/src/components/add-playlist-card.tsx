import React from "react";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function AddPlaylistCard() {
  return (
    <div style={{ padding: "0", margin: "0" }}>
      <Card style={{ width: "10rem", height: "16.5rem" }}>
        <Card.Body>
          <Row>
            <Link
              to="/playlists/create"
              style={{ textDecoration: "none", padding: "0.2rem" }}
            >
              <Card.Img
                variant="top"
                src="/new_playlist_icon.png"
                alt="new_playlist_icon"
              />
            </Link>
          </Row>
          <Row>
            <div>
              <h5
                style={{
                  fontWeight: "bold",
                  marginBottom: "3%",
                }}
              >
                New Playlist
              </h5>
              <p
                style={{
                  marginBottom: "5%",
                }}
              >
                &nbsp;
              </p>
            </div>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AddPlaylistCard;
