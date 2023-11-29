import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="py-3 bg-dark fixed-bottom text-center text-white-50">
      © 2023 SoundSync | A cross-platform playlist manager | All rights
      reserved.
      <br />
      <a
        href="https://github.com/ryanhu021/csc307-team-project"
        target="_blank"
        rel="noreferrer"
        className={"text-white-50"}
      >
        <FontAwesomeIcon icon={faGithub} />
      </a>
    </footer>
  );
}
