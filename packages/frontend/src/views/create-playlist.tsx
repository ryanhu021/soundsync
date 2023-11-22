import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type Inputs = {
  name: string;
};

export default function CreatePlaylist() {
  const { register, handleSubmit } = useForm<Inputs>();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name: data.name, imageUrl: "test" }),
    })
      .then(async (res) => {
        if (res.status === 201) {
          const playlist = await res.json();
          navigate(`/playlists/view/${playlist._id}`);
        } else {
          setError("Error creating playlist");
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Internal server error");
      });
  };

  return (
    <Container>
      <h1>Create Playlist</h1>
      <Form className="d-flex" onSubmit={handleSubmit(onSubmit)}>
        <Form.Control
          type="name"
          className="me-2 rounded-pill"
          {...register("name")}
          placeholder="Enter Playlist Name"
          aria-describedby="submit"
        />
        <Button type="submit" className="rounded-pill">
          Submit
        </Button>
      </Form>
      <p>{error}</p>
    </Container>
  );
}
