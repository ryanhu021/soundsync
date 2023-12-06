import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Floatinglabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { BackLink } from "../components/back-link";
import "../component-styles/login-signup.css";

type Inputs = {
  email: string;
  password: string;
  checkbox: boolean;
};

function LoginForm() {
  const { register, handleSubmit } = useForm<Inputs>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setErrorMessage("");
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/login`, {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          window.location.href = "/";
        } else {
          console.log(res.statusText);
          setErrorMessage("Invalid email and/or password");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <div className="wrapper">
        <BackLink />
        <h1 className="title">Login Page</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Floatinglabel className="mb-3" label="Email">
            <Form.Control
              type="email"
              placeholder="Email"
              required
              {...register("email")}
              className="field"
            />
          </Floatinglabel>
          <Floatinglabel className="mb-3" label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              required
              {...register("password")}
              className="field"
            />
          </Floatinglabel>
          <p className="error-message">{errorMessage}</p>
          <Row>
            <Button variant="primary" type="submit" className="field">
              Login
            </Button>
          </Row>
          <Row>
            <Link to="/signup" className="signup-link">
              Create Account
            </Link>
          </Row>
        </Form>
      </div>
    </Container>
  );
}

export default LoginForm;
