import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  url: string;
};

function SearchBar() {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };
  return (
    <Container className="mt-5">
      <Row>
        <Col sm={4}>
          <Form className="d-flex" onSubmit={handleSubmit(onSubmit)}>
            <Form.Control
              type="search"
              placeholder="Enter Song URL"
              className="me-2 rounded-pill"
              aria-label="Search"
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
        </Col>
      </Row>
    </Container>
  );
}

export default SearchBar;
