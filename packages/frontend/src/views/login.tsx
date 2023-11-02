import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Floatinglabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

type Inputs = {
  email: string;
  password: string;
  checkbox: boolean;
};

function LoginForm() {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <div>
      <Link to="/">Back to Home</Link>
      <h1>Login Page</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Floatinglabel className="mb-3" label="Email">
          <Form.Control
            type="email"
            placeholder="Email"
            required
            {...register("email")}
          />
        </Floatinglabel>
        <Floatinglabel className="mb-3" label="Password">
          <Form.Control
            type="password"
            placeholder="password"
            required
            {...register("password")}
          />
        </Floatinglabel>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Remember Me"
            {...register("checkbox")}
          ></Form.Check>
        </Form.Group>
        <Row>
          <Col>
            <Button variant="primary">Create Account</Button>
          </Col>
          <Col>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default LoginForm;
