import React from "react";
import { Spinner } from "react-bootstrap";

export default function ComponentCenteredSpinner() {
  return (
    <div className="d-flex justify-content-center">
      <Spinner animation="border" role="status" variant="secondary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
