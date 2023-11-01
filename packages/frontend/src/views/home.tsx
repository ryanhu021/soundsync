import React from "react";
import SignUpForm from "../components/signup-form";
import LoginForm from "../components/login-form";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <SignUpForm />
      <LoginForm />
    </>
  );
}
