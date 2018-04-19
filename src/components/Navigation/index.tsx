import * as React from 'react'
import { Navbar, NavbarToggler, Collapse } from 'reactstrap'
import { User } from 'firebase'
import './index.css'
import AuthMenu from '../AuthMenu'
import MainMenu from '../MainMenu'
import ToggleContainer from '../../containers/ToggleContainer'
import NavBrandLink from '../../components/NavBrandLink'

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

    render() {
        return (
            <Navbar dark expand="md" color="dark" className="navigation">
                <NavBrandLink />
                <ToggleContainer>
                    {(toggled, toggle, toggleOff, toggleOn): React.ReactElement<{}> => 
                        <React.Fragment>
                            <NavbarToggler
                                type="button"
                                onClick={toggle}
                            />
                            <Collapse
                                isOpen={toggled}
                                navbar
                            >
                                <MainMenu onLinkClick={toggleOff} />
                                <AuthMenu onLinkClick={toggleOff} />
                            </Collapse>
                        </React.Fragment>}
                </ToggleContainer>
            </Navbar>
        )
    }
}