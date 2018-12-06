import * as React from 'react'
import Nav from 'reactstrap/lib/Nav'
import NavItem from 'reactstrap/lib/NavItem'
import User from '../../types/User'
import UserContainer from '../../containers/UserContainer'

export default function AuthMenu(): React.ReactElement<{}> {
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