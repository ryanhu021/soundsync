import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Floatinglabel from "react-bootstrap/FloatingLabel";

function SignUpForm() {
  return (
    <Form>
      <Floatinglabel className="mb-3" label="Name" controlId="floatingInput">
        <Form.Control type="name" placeholder="Name" />
      </Floatinglabel>
      <Floatinglabel className="mb-3" label="Email" controlId="floatingInput">
        <Form.Control type="email" placeholder="Email" />
      </Floatinglabel>
      <Floatinglabel
        className="mb-3"
        label="Password"
        controlId="floatingInput"
      >
        <Form.Control type="password" placeholder="password" />
      </Floatinglabel>
      <Floatinglabel
        className="mb-3"
        label="Confirm Password"
        controlId="floatingInput"
      >
        <Form.Control type="password" placeholder="confirm password" />
      </Floatinglabel>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Remember Me"></Form.Check>
      </Form.Group>
      <Button variant="primary" type="submit">
        SignUp
      </Button>
    </Form>
  );
}

export default SignUpForm;
