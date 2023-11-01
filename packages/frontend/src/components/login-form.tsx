import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Floatinglabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function LoginForm() {
  return (
    <Form>
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
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Remember Me"></Form.Check>
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
  );
}

export default LoginForm;
