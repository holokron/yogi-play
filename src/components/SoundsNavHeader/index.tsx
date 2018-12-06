import * as React from 'react'
import Nav from 'reactstrap/lib/Nav'
import NavItem from 'reactstrap/lib/NavItem'
import NavLink from 'reactstrap/lib/NavLink'
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