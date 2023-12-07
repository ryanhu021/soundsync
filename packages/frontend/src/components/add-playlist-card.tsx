import React from "react";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../component-styles/add-playlist-card.css";

function AddPlaylistCard() {
  return (
    <div className="add-playlist-container">
      <Card className="add-playlist-card">
        <Card.Body>
          <Row>
            <Link to="/playlists/create" className="add-playlist-link">
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
                className="add-playlist-info mt-3"
                style={{
                  marginBottom: "19.45px",
                }}
              >
                New Playlist
              </h5>
            </div>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AddPlaylistCard;
