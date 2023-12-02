import React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./auth-provider";

export default function DeezerCallback() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("code");
  const playlistId = searchParams.get("state");

  return (
    <p>
      {"token: " + token + " playlistId: " + playlistId + " user: " + user.name}
    </p>
  );
}
