import useUser from "@/hooks/useUser";
import { Nav, NavItem } from "reactstrap";

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
