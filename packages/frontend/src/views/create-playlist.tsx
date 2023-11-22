import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
};

export default function CreatePlaylist() {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data.name);
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
        <Button
          type="submit"
          className="rounded-pill"
          variant="outline-primary"
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}
