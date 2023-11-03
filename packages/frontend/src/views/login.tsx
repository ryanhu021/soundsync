import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Floatinglabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

type Inputs = {
  email: string;
  password: string;
  checkbox: boolean;
};

function LoginForm() {
  const { register, handleSubmit } = useForm<Inputs>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useCookies(["user", "token"]);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/login`, {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          const json = await res.json();
          setCookie("user", json.user, { path: "/" });
          setCookie("token", json.token, { path: "/" });
          navigate("/", { replace: true });
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
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Remember Me"
            {...register("checkbox")}
          ></Form.Check>
        </Form.Group>
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
