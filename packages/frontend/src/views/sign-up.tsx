import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Floatinglabel from "react-bootstrap/FloatingLabel";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { BackLink } from "../components/back-link";
import "../component-styles/login-signup.css";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/register`, {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => res.status === 201 && (window.location.href = "/"))
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <div className="wrapper">
        <BackLink />
        <h1 className="title">Sign Up Page</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Floatinglabel className="mb-3" label="Name">
            <Form.Control
              type="name"
              placeholder="Name"
              required
              {...register("name")}
              className="field"
            />
          </Floatinglabel>
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
          <Floatinglabel className="mb-3" label="Confirm Password">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              required
              {...register("confirmPassword", {
                validate: (value) => value === getValues().password,
              })}
              className="field"
            />
            {errors.confirmPassword && <p>Password must match.</p>}
          </Floatinglabel>
          <Button variant="primary" type="submit" className="field">
            Sign Up
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default SignUpForm;
