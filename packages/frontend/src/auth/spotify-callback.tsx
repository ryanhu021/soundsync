import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FullScreenSpinner from "../components/full-screen-spinner";

export default function SpotifyCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("code");
  const playlistId = searchParams.get("state");
  useEffect(() => {
    if (navigate && token && playlistId) {
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
              `/playlists/view/${playlistId}?exported=spotify&url=${url}&count=${count}`
            );
          } else {
            navigate(
              `/playlists/view/${playlistId}?exported=spotify&error=true`
            );
          }
        })
        .catch((err) => {
          console.log(err);
          navigate(`/playlists/view/${playlistId}?exported=spotify&error=true`);
        });
    }
  }, [navigate, playlistId, token]);

  return <FullScreenSpinner />;
}
