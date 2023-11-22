import React from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Playlist } from "../views/playlists";

interface PlaylistCardProps extends Playlist {
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

function PlaylistCard(props: PlaylistCardProps) {
  return (
    <div>
      <Card style={{ width: "10rem", height: "16.5rem" }}>
        <Card.Body>
          <Row>
            <Link
              to={`/playlists/view/${props._id}`}
              style={{ textDecoration: "none", padding: "0.2rem" }}
            >
              <Card.Img
                variant="top"
                src={props.imageUrl || "/empty_playlist_icon.png"}
                alt={props.name}
              />
            </Link>
          </Row>
          <Row>
            <div>
              <h5
                style={{
                  fontWeight: "bold",
                  marginBottom: "3%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                {props.name}
              </h5>
              <p
                style={{
                  marginBottom: "5%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                {props.creator}
              </p>
            </div>
          </Row>
          <Col style={{ display: "flex", justifyContent: "space-between" }}>
            <button style={{ border: "none", padding: 0, background: "none" }}>
              <Image
                src="/upload_icon.png"
                alt="upload"
                style={{
                  width: "1rem",
                }}
              />
            </button>
            <button
              style={{ border: "none", padding: 0, background: "none" }}
              onClick={props.onDelete}
            >
              <Image
                src="/delete_icon.png"
                alt="delete"
                style={{
                  width: "1rem",
                }}
              />
            </button>
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PlaylistCard;
