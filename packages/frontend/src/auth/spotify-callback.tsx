import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FullScreenSpinner from "../components/full-screen-spinner";

export default function SpotifyCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("code");
  const state = searchParams.get("state");
  const [hasFetched, setHasFetched] = useState(false);

  const makeImportRequest = (playlistUrl: string): void => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/import/spotify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token, playlistUrl }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          const playlistId = await res.json();
          navigate(`/playlists/view/${playlistId}`);
        } else {
          navigate("/playlists/create");
        }
      })
      .catch((err) => {
        console.log(err);
        navigate(`/playlists/view/${playlistUrl}?imported=spotify&error=true`);
      });
  };

  const makeExportRequest = (playlistId: string): void => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/export/spotify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token, playlistId }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          const { url, count } = await res.json();
          navigate(
            `/playlists/view/${state}?exported=spotify&url=${url}&count=${count}`
          );
        } else {
          navigate(`/playlists/view/${state}?exported=spotify&error=true`);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate(`/playlists/view/${state}?exported=spotify&error=true`);
      });
  };

  useEffect(() => {
    if (!hasFetched && token && state) {
      const [playlistIdOrUrl, type] = state.split(",");
      setHasFetched(true);
      if (type === "import") {
        makeImportRequest(playlistIdOrUrl);
      } else {
        makeExportRequest(playlistIdOrUrl);
      }
    }
  }, [state, token]);

  return <FullScreenSpinner />;
}
