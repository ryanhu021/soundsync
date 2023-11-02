import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Floatinglabel from "react-bootstrap/FloatingLabel";
import { Link } from "react-router-dom";

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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    if (data.password === data.confirmPassword) {
    }
  };

  return (
    <div>
      <Link to="/">Back to Home</Link>
      <h1>Sign Up Page</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Floatinglabel className="mb-3" label="Name">
          <Form.Control
            type="name"
            placeholder="Name"
            required
            {...register("name")}
          />
        </Floatinglabel>
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
            placeholder="Password"
            required
            {...register("password")}
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
          />
          {errors.confirmPassword && <p>Password must match.</p>}
        </Floatinglabel>
        <Button variant="primary" type="submit">
          SignUp
        </Button>
      </Form>
    </div>
  );
}

export default SignUpForm;

//<Form noValidate validated={validatedPassword} onSubmit={handleSubmit(onSubmit)}>
//   <Floatinglabel className="mb-3" label="Name" controlId="floatingInput">
//     <Form.Control type="name" placeholder="Name" />
//   </Floatinglabel>
//   <Floatinglabel className="mb-3" label="Email" controlId="floatingInput">
//     <Form.Control type="email" placeholder="Email" />
//   </Floatinglabel>
//   <Floatinglabel
//     className="mb-3"
//     label="Password"
//     controlId="floatingInput"
//   >
//     <Form.Control type="password" placeholder="password" />
//   </Floatinglabel>
//   <Floatinglabel
//     className="mb-3"
//     label="Confirm Password"
//     controlId="floatingInput"
//   >
//     <Form.Control type="password" placeholder="confirm password" />
//   </Floatinglabel>
//   <Form.Group className="mb-3" controlId="formBasicCheckbox">
//     <Form.Check type="checkbox" label="Remember Me"></Form.Check>
//   </Form.Group>
// <Button variant="primary" type="submit">
//   SignUp
// </Button>
// </Form>
