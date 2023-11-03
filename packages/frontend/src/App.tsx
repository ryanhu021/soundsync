import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ErrorPage from "./views/error-page";
import Root from "./views/home";
import Playlists from "./views/playlists";
import Playlist from "./views/playlist";
import SignUpForm from "./views/sign-up";
import LoginForm from "./views/login";
import SSNavbar from "./components/navbar";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <CookiesProvider>
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
    </CookiesProvider>
  );
}

export default App;
