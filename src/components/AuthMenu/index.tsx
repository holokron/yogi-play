import * as React from 'react'
import { Nav, NavItem } from 'reactstrap'
import User from '../../types/User'
import UserContainer from '../../containers/UserContainer'

export interface Props {
    onLinkClick?(): void 
}

export default function AuthMenu({onLinkClick = () => {}}: Props): React.ReactElement<Props> {
    return (
        <UserContainer>
            {(user: User | null): React.ReactElement<any> | null => {
                if (!user) {
                    return null
                }

                return (
                    <Nav navbar>
                        <NavItem>
                            <a href="#" className="nav-link text-uppercase">
                                {user.displayName}
                            </a>
                        </NavItem>
                    </Nav>
                )
            }}
        </UserContainer>
    )
}