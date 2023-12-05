import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FullScreenSpinner from "../components/full-screen-spinner";

export default function DeezerCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const playlistId = searchParams.get("state");
  const [hasFetchedToken, setHasFetchedToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (code && !hasFetchedToken && playlistId) {
      setHasFetchedToken(true);
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/oauth/deezer/token?code=${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )
        .then(async (res) => {
          if (res.status === 200) {
            const token = await res.json();
            console.log(token.token);
            fetch(`${process.env.REACT_APP_SERVER_URL}/export/deezer`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ token: token.token, playlistId }),
            })
              .then(async (res) => {
                if (res.status === 200) {
                  const { url, count } = await res.json();
                  console.log(url);
                  navigate(
                    `/playlists/view/${playlistId}?exported=deezer&url=${url}&count=${count}`
                  );
                } else {
                  navigate(
                    `/playlists/view/${playlistId}?exported=deezer&error=true`
                  );
                }
              })
              .catch((err) => {
                console.log(err);
                navigate(
                  `/playlists/view/${playlistId}?exported=deezer&error=true`
                );
              });
          } else {
            throw new Error("Error getting token");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [code, playlistId]);

  return <FullScreenSpinner />;
}
