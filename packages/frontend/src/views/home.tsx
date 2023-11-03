import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Home() {
  const [cookies] = useCookies(["user", "token"]);

  return (
    <>
      <h1>Home</h1>
      {cookies.user && cookies.token && (
        <>
          <h2>Welcome {cookies.user.name}</h2>
          <p>{cookies.user.email}</p>
          <p>{cookies.token}</p>
        </>
      )}
      <Link to="/signup">Sign up</Link>
      <Link to="/login">Login</Link>
    </>
  );
}
