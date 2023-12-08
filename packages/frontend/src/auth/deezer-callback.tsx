import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FullScreenSpinner from "../components/full-screen-spinner";

export default function DeezerCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const playlistId = state?.split(",")[0];
  const type = state?.split(",")[1];
  const [hasFetchedToken, setHasFetchedToken] = useState(false);
  const navigate = useNavigate();

  const makeImportRequest = (token: string, playlistUrl: string): void => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/import/deezer`, {
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
        navigate(`/playlists/view/${playlistUrl}?imported=deezer&error=true`);
      });
  };

  const makeExportRequest = (token: string, playlistId: string): void => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/export/deezer`, {
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
            `/playlists/view/${playlistId}?exported=deezer&url=${url}&count=${count}`
          );
        } else {
          navigate(`/playlists/view/${playlistId}?exported=deezer&error=true`);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate(`/playlists/view/${playlistId}?exported=deezer&error=true`);
      });
  };

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
            if (type === "import") {
              makeImportRequest(token.token, playlistId);
            } else {
              makeExportRequest(token.token, playlistId);
            }
          } else {
            throw new Error("Error getting token");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [code, type, playlistId]);

  return <FullScreenSpinner />;
}
