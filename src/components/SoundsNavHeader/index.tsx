import "./index.css";
import { Nav, NavItem, NavLink } from "reactstrap";

export interface Props {
  children: any;
}

export default function SoundsNavHeader({
  children
}: Props): React.ReactElement<Props> {
  return (
    <Nav pills className="sounds-nav justify-content-md-center">
      <NavItem>
        <NavLink
          href="#"
          active
          className="nav-link nav-link--rounded text-uppercase"
        >
          {children}
        </NavLink>
      </NavItem>
    </Nav>
  );
}
