import React from "react";
import { Spinner } from "react-bootstrap";

// make spinner full screen and greyed out
export default function FullScreenSpinner() {
  return (
    <div className="position-absolute top-0 start-0 d-flex justify-content-center align-items-center vh-100 vw-100 bg-light bg-opacity-50 z-3">
      <Spinner animation="border" role="status" variant="secondary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
