import React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./auth-provider";

export default function DeezerCallback() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("state");
  return <p>{token + user.name}</p>;
}
