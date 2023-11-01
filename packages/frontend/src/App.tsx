import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ErrorPage from "./error-page";
import Root from "./views/home";
import Playlists from "./views/playlists";
import Playlist from "./views/playlist";

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
