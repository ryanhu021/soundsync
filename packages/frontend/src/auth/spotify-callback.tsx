import React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./auth-provider";

export default function SpotifyCallback() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("code");
  const state = searchParams.get("state");
  //return a redirect back to the playlist page after the export has been completed
  // const res = fetch(`${process.env.REACT_APP_SERVER_URL}/export/spotify`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // if (res && res.status === 200) {
  //   return await res.json();
  // } else {
  //   setError("Error getting songs");
  // }

  return <p>{token + " " + state}</p>;
}
