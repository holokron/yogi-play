import * as React from "react";
import Nav from "reactstrap/lib/Nav";
import NavItem from "reactstrap/lib/NavItem";
import useUser from "../../hooks/useUser";

export default function AuthMenu(): React.ReactElement | null {
  const user = useUser();
  if (!user) {
    return null;
  }

  return (
    <Nav navbar>
      <NavItem>
        <a href="#" className="nav-link text-uppercase">
          {user.displayName}
        </a>
      </NavItem>
    </Nav>
  );
}
