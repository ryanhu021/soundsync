import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type BackLinkProps =
  | Omit<LinkProps, "children">
  | {
      to?: string;
    };

export const BackLink: React.FunctionComponent<BackLinkProps> = (
  props: BackLinkProps
): JSX.Element => {
  return (
    <Link
      {...props}
      to={props.to || "./.."}
      className="text-decoration-none align-items-center d-flex flex-row mt-3 mb-1"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
      Back
    </Link>
  );
};
