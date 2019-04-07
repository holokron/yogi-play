import * as React from "react";
import NavItem from "reactstrap/lib/NavItem";
import NavLink from "reactstrap/lib/NavLink";
import "./index.css";

export interface Props {
  children?: any;
  isActive?: boolean;
  onClick?(): void;
}

export default class SoundNavItem extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    isActive: false,
    onClick: () => {}
  };

  constructor(props: Props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event: React.SyntheticEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.props.onClick) {
      return;
    }

    this.props.onClick();
  }

  public render() {
    const {
      handleClick,
      props: { children, isActive }
    } = this;

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
}
