import * as React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, NavbarToggler, Collapse, NavItem, Nav } from 'reactstrap'
import { User } from 'firebase'

export interface Props {
    logout?: {(): void}
    user?: User | null
}

export interface State {
    toggled: boolean
}

export default class Navigation extends React.PureComponent<Props, State> {
    static defaultProps: Partial<Props> = {
        logout: () => {},
        user: null,
    }

    state: State = {
        toggled: false
    }

    constructor(props: Props) {
        super(props)

        this.closeMenu = this.closeMenu.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
    }

    closeMenu() {
        this.setState(() => ({
            toggled: false,
        }))
    }

    toggleMenu() {
        this.setState(({ toggled }: State) => ({
            toggled: !toggled,
        }))
    }

    renderMainMenu() {
        return (
            <Nav navbar className="mr-auto">
                <NavItem>
                    <Link to="/ulubione" className="nav-link" onClick={this.closeMenu}>
                        Ulubione <small className="text-muted">Soon</small>
                    </Link>
                </NavItem>
                <NavItem>
                    <Link to="/dodaj" className="nav-link" onClick={this.closeMenu}>
                        Dodaj dźwięk <small className="text-muted">Soon</small>
                    </Link>
                </NavItem>
            </Nav>
        )
    }

    renderAuthMenu() {
        const {
            logout,
            user,
        } = this.props

        if (user) {
            return (
                <Nav navbar>
                    <NavItem>
                        <a href="#" className="nav-link">
                            {user.email}
                        </a>
                    </NavItem>
                    <NavItem>
                        <a href="#" onClick={logout} className="nav-link">
                            Wyloguj
                        </a>
                    </NavItem>
                </Nav>
            )
        }

        return (
            <Nav navbar>
                <NavItem>
                    <Link to="/logowanie" className="nav-link" onClick={this.closeMenu}>
                        Logowanie
                    </Link>
                </NavItem>
                <NavItem>
                    <Link to="/rejestracja" className="nav-link" onClick={this.closeMenu}>
                        Rejestracja
                    </Link>
                </NavItem>
            </Nav>
        )
    }

    render() {
        return (
            <Navbar dark expand="md" color="dark">
                <Link to="/" className="navbar-brand">                    
                    <img 
                        className="d-inline-block align-top" 
                        alt="Yogi PLAY" 
                        width={30} 
                        src="/icons/icon-64x64.png" 
                    /> Yogi PLAY
                </Link>
                <NavbarToggler
                    type="button"
                    onClick={this.toggleMenu}
                />
                <Collapse
                    isOpen={this.state.toggled}
                    navbar
                >
                    {this.renderMainMenu()}
                    {this.renderAuthMenu()}
                </Collapse>
            </Navbar>
        )
    }
}