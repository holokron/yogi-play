import * as React from 'react'
import { Nav, Navbar, Collapse, NavbarToggler } from 'reactstrap'
import ToggleContainer from '../../containers/ToggleContainer'
import './index.css'
import { Link } from 'react-router-dom'

export interface Props {
    children?: any
}

export default function SoundsNav({ children = null }: Props) {
    return (
        <Navbar dark expand="md" color="dark" className="sounds-nav">
            <Link to="/" className="navbar-brand">                    
                <img 
                    className="d-inline-block align-top" 
                    alt="Yogi PLAY" 
                    width={30} 
                    src="/icons/icon-64x64.png" 
                /> Yogi PLAY
            </Link>
            <ToggleContainer>
                {(toggled, toggle, toggleOff) =>
                    <React.Fragment> 
                        <NavbarToggler
                            type="button"
                            onClick={() => toggle()}
                        />
                        <Collapse
                            isOpen={toggled}
                            navbar
                        >
                            <Nav navbar className="mr-auto">
                                {children}
                            </Nav>
                        </Collapse>
                    </React.Fragment>
                }
            </ToggleContainer>
        </Navbar>
    )
}