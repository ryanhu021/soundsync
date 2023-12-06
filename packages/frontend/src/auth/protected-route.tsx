import React from "react";
import { useAuth } from "./auth-provider";
import { Navigate } from "react-router-dom";
import FullScreenSpinner from "../components/full-screen-spinner";

export const ProtectedRoute: React.FunctionComponent<
  React.PropsWithChildren
> = ({ children }): JSX.Element => {
  const { user, loading } = useAuth();

  return loading ? (
    <FullScreenSpinner />
  ) : user.name ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};
