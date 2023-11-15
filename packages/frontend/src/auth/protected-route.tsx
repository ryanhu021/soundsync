import React from "react";
import { useAuth } from "./auth-provider";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FunctionComponent<
  React.PropsWithChildren
> = ({ children }): JSX.Element => {
  const { name } = useAuth();

  if (!name) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
