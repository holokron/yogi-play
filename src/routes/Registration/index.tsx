import * as React from 'react'
import { Link } from 'react-router-dom'
import { Col, Card, CardTitle, CardSubtitle, CardBody, Row } from 'reactstrap'
import Container from '../../components/Container'
import RegistrationForm from '../../forms/RegistrationForm'
import DefaultTemplate from '../../templates/DefaultTemplate'
import ExternalAuthProviders from '../../components/ExternalAuthProviders'
import auth from '../../lib/auth'

export default class Registration extends React.PureComponent<{}, {}> {
    constructor(props: object) {
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(email: string, password: string): Promise<void> {
        return auth.register(email, password)
    }

    render() {
        return (
            <DefaultTemplate>
                <Container>
                    <Row className="justify-content-md-center">
                        <Col lg="5" md="8" className="mb-4">
                            <Card>
                                <CardBody>
                                    <CardTitle>
                                        Rejestracja
                                    </CardTitle>
                                    <CardSubtitle className="mb-3 text-muted">
                                        Zarejestruj się aby mieć dostęp do pełnej funcjonalności Yogi PLAY
                                    </CardSubtitle>
                                    <RegistrationForm onSubmit={this.handleSubmit} />     
                                    <br />
                                    <span>Posiadasz już konto? <Link to="/logowanie">Zaloguj się</Link></span>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="5" md="8">
                            <Card>
                                <CardBody>
                                    <CardTitle>
                                        Rejestracja
                                    </CardTitle>
                                    <CardSubtitle className="mb-3 text-muted">
                                        Zarejestruj się za pomocą serwisu zewnętrznego
                                    </CardSubtitle>
                                    <ExternalAuthProviders
                                        onLoginWithGoogle={auth.loginWithGoogle}
                                        onLoginWithFacebook={auth.loginWithFacebook}
                                        googleLoginLabel="Zarejestruj z Google"
                                        facebookLoginLabel="Zarejestruj z Facebook"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </DefaultTemplate>
        )
    }
}