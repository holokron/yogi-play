import * as React from 'react'
import { Link } from 'react-router-dom'
import { Col } from 'reactstrap'
import Container from '../../components/Container'
import Row from '../../components/Row'

export default function Favourities(): React.ReactElement<{}> {
    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <h1 className="display-4">Wkrótce</h1>
                    <p className="lead">
                        Tutaj będzie lista twoich ulubionych dźwięków.
                    </p>
                    <br />
                    <Link className="btn btn-primary" to="/">
                        Home
                    </Link>
                </Col>
            </Row>
        </Container>
    )
}