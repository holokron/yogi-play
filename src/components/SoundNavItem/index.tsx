import React, { ReactElement, SyntheticEvent } from "react";
import "./index.css";
import { NavItem, NavLink } from "reactstrap";

export interface Props {
  children?: any;
  isActive?: boolean;
  onClick?(): void;
}

export default function SoundNavItem({
  children,
  onClick,
  isActive = false
}: Props): ReactElement<Props> {
  const handleClick = (event: SyntheticEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    if (!onClick) {
      return;
    }

    onClick();
  };

  return (
    <NavItem>
      <NavLink
        href="#"
        active={isActive}
        onClick={handleClick}
        className="nav-link nav-link--rounded text-uppercase"
      >
        {children}
      </NavLink>
    </NavItem>
  );
}
