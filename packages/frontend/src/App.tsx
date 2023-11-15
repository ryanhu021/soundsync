import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ErrorPage from "./views/error-page";
import Home from "./views/home";
import Playlists from "./views/playlists";
import CreatePlaylist from "./views/playlist";
import SignUpForm from "./views/sign-up";
import LoginForm from "./views/login";
import SSNavbar from "./components/navbar";
import { AuthProvider } from "./auth/auth-provider";
import { ProtectedRoute } from "./auth/protected-route";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SSNavbar />
        <Routes>
          <Route path="/" element={<Home />} errorElement={<ErrorPage />} />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <Playlists />
              </ProtectedRoute>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/playlists/create"
            element={
              <ProtectedRoute>
                <CreatePlaylist />
              </ProtectedRoute>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/playlists/view/:id"
            element={<p>TODO: view playlist</p>}
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
    </AuthProvider>
  );
}

export default App;
