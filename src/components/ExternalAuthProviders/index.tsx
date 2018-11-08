import * as React from 'react'
import { UncontrolledAlert, Button, ButtonGroup, Col, Row } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface Props {
    googleLoginLabel: string
    facebookLoginLabel: string
    onLoginWithGoogle(): Promise<any>
    onLoginWithFacebook(): Promise<any>
}

export interface State {
    error: boolean
    isGoogleLoading: boolean
    isFacebookLoading: boolean
}

export default class ExternalAuthProviders extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            error: false,
            isGoogleLoading: false,
            isFacebookLoading: false,
        }

        this.handleGoogleLogin = this.handleGoogleLogin.bind(this)
        this.handleFacebookLogin = this.handleFacebookLogin.bind(this)
    }

    async handleGoogleLogin(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault()
        
        if (this.state.isGoogleLoading) {
            return
        }

        this.setState({
            error: false,
            isGoogleLoading: true,
        })

        try {
            await this.props.onLoginWithGoogle()
        } catch (error) {
            this.setState({
                error: true,
                isGoogleLoading: false,
            })
        }
    }

    async handleFacebookLogin(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault()
        
        if (this.state.isFacebookLoading) {
            return
        }

        this.setState({
            error: false,
            isFacebookLoading: true,
        })

        try {
            await this.props.onLoginWithFacebook()
        } catch (error) {
            this.setState({
                error: true,
                isFacebookLoading: false,
            })
        }
    }

    render () {
        const {
            state: {
                error,
                isGoogleLoading,
                isFacebookLoading,
            },
            handleGoogleLogin,
            handleFacebookLogin,
            props: {
                googleLoginLabel,
                facebookLoginLabel,
            },
        } = this

        return (
            <Row>
                {error && 
                    <Col md="12" className="mt-3">
                        <UncontrolledAlert color="danger">
                            Bład połaczenia lub konto o tym samym adresie email już istnieje.
                            Spróbuj zalogować się innym kontem.
                        </UncontrolledAlert>
                    </Col>
                }
                <Col md="12" className="mt-3">
                    <ButtonGroup className="btn-block">
                        <Button active color="primary">
                            <FontAwesomeIcon icon="google" size="lg" fixedWidth />
                        </Button>
                        <Button onClick={handleGoogleLogin} color="primary" className="btn-block">
                            {isGoogleLoading && <FontAwesomeIcon icon="spinner" pulse fixedWidth />}
                            &nbsp; {googleLoginLabel}
                        </Button>
                    </ButtonGroup>
                </Col>
                <Col md="12" className="mt-3">
                    <ButtonGroup className="btn-block">
                        <Button active color="primary">
                            <FontAwesomeIcon icon="facebook" size="lg" fixedWidth />
                        </Button>
                        <Button onClick={handleFacebookLogin} color="primary" className="btn-block">
                            {isFacebookLoading && <FontAwesomeIcon icon="spinner" pulse fixedWidth />}
                            &nbsp; {facebookLoginLabel}
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
        )
    }
}