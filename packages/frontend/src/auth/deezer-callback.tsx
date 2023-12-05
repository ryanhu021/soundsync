import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./auth-provider";

export default function DeezerCallback() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const playlistId = searchParams.get("state");
  const [token, setToken] = useState("");
  const [hasFetchedToken, setHasFetchedToken] = React.useState(false);

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
            const accessToken = await res.json();
            setToken(accessToken.token);
          } else {
            throw new Error("Error getting token");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [code, playlistId]);

  return (
    <p>
      {"code: " +
        code +
        " token: " +
        token +
        " playlistId: " +
        playlistId +
        " user: " +
        user.name}
    </p>
  );
}
