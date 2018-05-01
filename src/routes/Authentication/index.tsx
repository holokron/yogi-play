import * as React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { User } from 'firebase'
import Container from '../../components/Container'
import {
    Col,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Row,
} from 'reactstrap'
import AuthenticationForm from '../../forms/AuthenticationForm'
import ExternalAuthProviders from '../../components/ExternalAuthProviders'
import AuthContainer from '../../containers/AuthContainer'
import NavigationContainer from '../../containers/NavigationContainer'
import { Auth } from '../../lib/auth'
import { Location } from 'history'

export interface Props {
    location?: Location
}

export default class Authentication extends React.PureComponent<Props> {
    render() {
        return (
            <AuthContainer>
                {(user: User | null, auth: Auth) => {
                    if (user) {
                        const to: string = this.props.location && this.props.location.state
                            ? this.props.location.state.referrer || '/'
                            : '/'

                        return <Redirect to={to} />
                    }

                    return (
                        <React.Fragment>
                            <NavigationContainer />
                            <Container>
                                <Row className="justify-content-md-center">
                                    <Col lg="5" md="8" className="mb-4">
                                        <Card>
                                            <CardBody>
                                                <CardTitle>
                                                    Logowanie
                                                </CardTitle>
                                                <CardSubtitle className="mb-3 text-muted">
                                                    Zaloguj się aby mieć dostęp do swoich ulubionych dźwięków
                                                </CardSubtitle>
                                                <AuthenticationForm onSubmit={auth.login} />
                                                <br />
                                                <span>
                                                    Nie posiadasz jeszcze konta? 
                                                    &nbsp;
                                                    <Link to="/rejestracja">Zarejestruj się</Link>
                                                </span>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg="5" md="8">
                                        <Card>
                                            <CardBody>
                                                <CardTitle>
                                                    Logowanie
                                                </CardTitle>
                                                <CardSubtitle className="mb-3 text-muted">
                                                    Zaloguj się za pomocą serwisów zewnętrznych
                                                </CardSubtitle>
                                                <ExternalAuthProviders
                                                    onLoginWithGoogle={auth.loginWithGoogle}
                                                    onLoginWithFacebook={auth.loginWithFacebook}
                                                    googleLoginLabel="Zaloguj z Google"
                                                    facebookLoginLabel="Zaloguj z Facebook"
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </React.Fragment>
                    )
                }}
            </AuthContainer>
        )
    }
}