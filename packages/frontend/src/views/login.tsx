import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Floatinglabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

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
        <p>{errorMessage}</p>
        <Row>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Row>
        <Row>
          <Link to="/signup">Create Account</Link>
        </Row>
      </Form>
    </div>
  );
}

export default LoginForm;
