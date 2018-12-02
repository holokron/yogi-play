import * as React from 'react'
import { Nav, NavItem } from 'reactstrap'
import { Link } from 'react-router-dom'

export interface Props {
    onLinkClick?(): void 
}

export default function MainMenu({ onLinkClick = () => {} }: Props): React.ReactElement<Props> {
    return (
        <Nav navbar className="mr-auto">
            <NavItem>
                <Link to="/ulubione" className="nav-link text-uppercase" onClick={onLinkClick}>
                    Ulubione
                </Link>
            </NavItem>
            <NavItem>
                <Link to="/dodaj" className="nav-link text-uppercase" onClick={onLinkClick}>
                    Dodaj dźwięk <small className="text-muted">Soon</small>
                </Link>
            </NavItem>
        </Nav>
    )
}