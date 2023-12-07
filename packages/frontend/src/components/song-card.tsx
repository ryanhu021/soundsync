import React from "react";
import { Card, Stack, Image, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Song } from "../views/view-playlist";
import "../component-styles/song-card.css";

interface SongCardProps extends Song {
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

function SongCard(props: SongCardProps) {
  const share = () => {
    navigator.clipboard.writeText(props.providerUrl);
    window.alert("Link copied to clipboard!");
  };

  return (
    <Card className="song-card">
      <Card.Body
        style={{
          padding: "0  0 0  0",
          margin: "0 0 0 0.25rem",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Stack direction="horizontal" gap={1}>
          <Link
            to={props.providerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                width: "4.5rem",
                height: "4.5rem",
              }}
            >
              <Image
                src={props.imageUrl}
                alt={props.name}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />
            </div>
          </Link>
          <Col>
            <h5
              style={{
                fontWeight: "bold",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "50vw",
                whiteSpace: "nowrap",
              }}
            >
              {props.name}
            </h5>
            <p
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "50vw",
                whiteSpace: "nowrap",
              }}
            >
              {props.artist} • {props.album}
            </p>
          </Col>
          <Col
            style={{
              position: "absolute",
              right: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
            className="song-actions"
          >
            <button
              onClick={share}
              style={{ border: "none", padding: 0, background: "none" }}
            >
              <Image
                src="/upload_icon.png"
                alt="upload"
                className="song-actions-images"
              />
            </button>
            <button
              onClick={props.onDelete}
              style={{ border: "none", padding: 0, background: "none" }}
            >
              <Image
                src="/delete_icon.png"
                alt="delete"
                className="song-actions-images"
              />
            </button>
          </Col>
        </Stack>
      </Card.Body>
    </Card>
  );
}

export default SongCard;
