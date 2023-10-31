import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorPage from "./error-page";
import Root from "./routes/root";
import Playlists from "./routes/playlists";
import Playlist from "./routes/playlist";

function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <Root />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/playlists",
          element: <Playlists />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/playlist",
          element: <Playlist />,
          errorElement: <ErrorPage />,
        },
      ])}
    />
  );
}

export default App;
