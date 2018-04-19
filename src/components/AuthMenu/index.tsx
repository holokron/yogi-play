import * as React from 'react'
import { User } from 'firebase'
import { Nav, NavItem } from 'reactstrap'
import { Link } from 'react-router-dom'
import AuthContainer from '../../containers/AuthContainer'
import { Auth } from '../../lib/auth'

export interface Props {
    onLinkClick?(): void 
}

export default function AuthMenu({onLinkClick = () => {}}: Props): React.ReactElement<Props> {
    return (
        <AuthContainer>
            {(user: User | null, auth: Auth): React.ReactElement<any> => {
                if (user) {
                    return (
                        <Nav navbar>
                            <NavItem>
                                <a href="#" className="nav-link text-uppercase">
                                    {user.email}
                                </a>
                            </NavItem>
                            <NavItem>
                                <a href="#" onClick={auth.logout} className="nav-link text-uppercase">
                                    Wyloguj
                                </a>
                            </NavItem>
                        </Nav>
                    )
                }
            
                return (
                    <Nav navbar>
                        <NavItem>
                            <Link to="/logowanie" className="nav-link text-uppercase" onClick={onLinkClick}>
                                Logowanie
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/rejestracja" className="nav-link text-uppercase" onClick={onLinkClick}>
                                Rejestracja
                            </Link>
                        </NavItem>
                    </Nav>
                )
            }}
        </AuthContainer>
    )
}