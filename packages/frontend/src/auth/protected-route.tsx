import React from "react";
import { useAuth } from "./auth-provider";
import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

export const ProtectedRoute: React.FunctionComponent<
  React.PropsWithChildren
> = ({ children }): JSX.Element => {
  const { user, loading } = useAuth();
  
  return loading ? (
    <Spinner />
  ) : user.name ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};
