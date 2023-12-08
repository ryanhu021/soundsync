import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ErrorPage from "./views/error-page";
import Home from "./views/home";
import Playlists from "./views/playlists";
import CreatePlaylist from "./views/create-playlist";
import SignUpForm from "./views/sign-up";
import LoginForm from "./views/login";
import NavigationBar from "./components/navigation-bar";
import Help from "./views/help";
import { AuthProvider } from "./auth/auth-provider";
import { ProtectedRoute } from "./auth/protected-route";
import SpotifyCallback from "./auth/spotify-callback";
import ViewPlaylist from "./views/view-playlist";
import Footer from "./components/footer";
import DeezerCallback from "./auth/deezer-callback";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100 justify-content-between">
          <div>
            <NavigationBar />
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
                element={<ViewPlaylist />}
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
              <Route
                path="/help"
                element={<Help />}
                errorElement={<ErrorPage />}
              />
              <Route
                path="/auth/spotify/callback"
                element={<SpotifyCallback />}
                errorElement={<ErrorPage />}
              />
              <Route
                path="/auth/deezer/callback"
                element={<DeezerCallback />}
                errorElement={<ErrorPage />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
