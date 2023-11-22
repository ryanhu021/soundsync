import React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./auth-provider";

export default function SpotifyCallback() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("code");
  return <p>{token! + user.name}</p>;
}
