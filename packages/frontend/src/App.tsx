import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ErrorPage from "./error-page";
import Root from "./views/home";
import Playlists from "./views/playlists";
import Playlist from "./views/playlist";
import SignUpForm from "./views/sign-up";
import LoginForm from "./views/login";
import SSNavbar from "./components/navbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <SSNavbar />
        <Routes>
          <Route path="/" element={<Root />} errorElement={<ErrorPage />} />
          <Route
            path="/playlists"
            element={<Playlists />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="/playlist"
            element={<Playlist />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="/login"
            element={<LoginForm />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="/signup"
            element={<SignUpForm />}
            errorElement={<ErrorPage />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
