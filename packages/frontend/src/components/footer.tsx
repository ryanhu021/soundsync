import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-3 bg-dark text-center text-white-50">
      © 2023 SoundSync | A cross-platform playlist manager | All rights
      reserved.
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link
          className={"text-white-50"}
          style={{ marginRight: "0.25rem", textDecoration: "none" }}
          to="/help"
        >
          Help
        </Link>
        <a
          href="https://github.com/ryanhu021/csc307-team-project"
          target="_blank"
          rel="noreferrer"
          className={"text-white-50"}
          style={{ marginLeft: "0.25rem" }}
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>
    </footer>
  );
}
