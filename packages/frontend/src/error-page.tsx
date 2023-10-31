import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    console.error(error);

    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occured.</p>
        <p>
          <i>
            {error.status} {error.statusText}
          </i>
        </p>
      </div>
    );
  } else {
    console.error(error);
    return <p>Unknown Error!</p>;
  }
}
