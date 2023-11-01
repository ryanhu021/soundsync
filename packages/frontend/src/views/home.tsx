import React from "react";
import NavigationBar from "../components/navigationbar";
import SignUpForm from "../components/signup-form";
import LoginForm from "../components/login-form";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <NavigationBar />
      <SignUpForm />
      <LoginForm />
    </>
  );
}
