import React, { ReactElement } from "react";
import Nav from "reactstrap/lib/Nav";
import NavItem from "reactstrap/lib/NavItem";
import { Link } from "react-router-dom";

export interface Props {
  onLinkClick?(): void;
}

export default function MainMenu({
  onLinkClick = () => {}
}: Props): ReactElement<Props> {
  return (
    <Nav navbar className="mr-auto">
      <NavItem>
        <Link
          to="/ulubione"
          className="nav-link text-uppercase"
          onClick={onLinkClick}
        >
          Ulubione
        </Link>
      </NavItem>
      <NavItem>
        <a
          href="https://github.com/holokron/yogi-play/issues/new?labels=sounds&assignee=michalv8"
          rel="noopener noreferrer"
          target="_blank"
          className="nav-link text-uppercase"
        >
          Dodaj dźwięk
        </a>
      </NavItem>
    </Nav>
  );
}
