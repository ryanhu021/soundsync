import React from "react";
import { Card, Stack, Image, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Song {
  name: string;
  artist: string;
  album: string;
  imageURL: string;
  songURL: string;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

function SongCard(props: Song) {
  return (
    <Card
      style={{
        width: "100%",
        height: "5rem",
      }}
    >
      <Card.Body
        style={{
          padding: "0  0 0  0",
          margin: "0 0 0 0.25rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack direction="horizontal" gap={1}>
          <Link
            to={props.songURL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Image
              src={props.imageURL}
              alt={props.name}
              style={{
                height: "4.5rem",
              }}
            />
          </Link>

          <div>
            <h5 style={{ fontWeight: "bold" }}>{props.name}</h5>
            <p>
              {props.artist} • {props.album}
            </p>
          </div>
          <Col
            style={{
              position: "absolute",
              right: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button style={{ border: "none", padding: 0, background: "none" }}>
              <Image
                src="/upload_icon.png"
                alt="upload"
                style={{
                  width: "1rem",
                  marginRight: "0.3rem",
                }}
              />
            </button>
            <button
              onClick={props.onDelete}
              style={{ border: "none", padding: 0, background: "none" }}
            >
              <Image
                src="/delete_icon.png"
                alt="delete"
                style={{
                  marginLeft: "0.3rem",
                  width: "1rem",
                }}
              />
            </button>
          </Col>
        </Stack>
      </Card.Body>
    </Card>
  );
}

export default SongCard;
