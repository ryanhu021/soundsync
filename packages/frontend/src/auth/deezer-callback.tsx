import React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./auth-provider";

export default function asyncDeezerCallback() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const playlistId = searchParams.get("state");
  // const [token, setToken] = React.useState("");

  const getToken = (code: string) => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/oauth/deezer/token?code=${code}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };
  //     .then(async (res) => {
  //       if (res.status === 200) {
  //         const accessToken = await res.json();
  //         console.log(accessToken.access_token);
  //         setToken(accessToken.access_token);
  //       } else {
  //         throw new Error("Error getting token");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  getToken(code || "");

  return (
    <p>
      {"code: " +
        code +
        // " token: " +
        // token +
        " playlistId: " +
        playlistId +
        " user: " +
        user.name}
    </p>
  );
}
