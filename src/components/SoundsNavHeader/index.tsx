import * as React from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap'
import './index.css'

export interface Props {
    children: any
}

export default function SoundsNavHeader({ children }: Props): React.ReactElement<Props> {
    return (
        <Nav pills className="sounds-nav">
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
    )
}