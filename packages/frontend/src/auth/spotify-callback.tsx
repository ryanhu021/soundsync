import React from "react";
import { useSearchParams } from "react-router-dom";

export default function SpotifyCallback() {
  const [searchParams] = useSearchParams();
  return <p>{searchParams.get("code")}</p>;
}
