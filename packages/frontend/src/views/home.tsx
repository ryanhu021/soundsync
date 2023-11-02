import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Link to="/signup">Sign up</Link>
      <Link to="/login">Login</Link>
    </>
  );
}
