import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  url: string;
};

function SearchBar() {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/search/url`, {
      method: "POST",
      body: JSON.stringify({
        url: data.url,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <Form className="d-flex" onSubmit={handleSubmit(onSubmit)}>
        <Form.Control
          type="search"
          placeholder="Enter Song URL"
          className="me-2 rounded-pill"
          {...register("url")}
        />
        <Button
          className="rounded-pill"
          variant="outline-primary"
          type="submit"
        >
          Search
        </Button>
      </Form>
    </Container>
  );
}

export default SearchBar;
