import React from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Playlist } from "../views/playlists";
import "../component-styles/playlist-card.css";

interface PlaylistCardProps extends Playlist {
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

function PlaylistCard(props: PlaylistCardProps) {
  const share = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/playlists/view/${props._id}`
    );
    window.alert("Link copied to clipboard!");
  };

  return (
    <div>
      <Card className="playlist-card">
        <Card.Body>
          <Row>
            <Link to={`/playlists/view/${props._id}`} className="playlist-link">
              <div className="playlist-card-img-container">
                <Card.Img
                  variant="top"
                  src={props.imageUrl || "/temp_playlist_icon.png"}
                  alt={props.name}
                />
              </div>
            </Link>
          </Row>
          <Row>
            <div>
              <h5 className="playlist-info">{props.name}</h5>
              <p className="playlist-creator">{props.creator}</p>
            </div>
          </Row>
          <Col className="playlist-actions">
            <button onClick={share}>
              <Image src="/upload_icon.png" alt="upload" />
            </button>
            <button onClick={props.onDelete}>
              <Image src="/delete_icon.png" alt="delete" />
            </button>
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PlaylistCard;
