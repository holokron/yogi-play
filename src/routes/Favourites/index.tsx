import * as React from 'react'
import { Link } from 'react-router-dom'
import { Col } from 'reactstrap'
import Container from '../../components/Container'
import Row from '../../components/Row'
import DefaultTemplate from '../../templates/DefaultTemplate'
import { AppDispatch, /*authenticate*/ } from '../../store/actions'
import { connect } from 'react-redux'

export interface Props {
    authenticate: {(): void}
}

class Favourites extends React.PureComponent<Props> {
    componentDidMount() {
        this.props.authenticate()
    }

    render() {
        return (
            <DefaultTemplate>
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
            </DefaultTemplate>
        )
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    authenticate: () => {
        // dispatch(authenticate())
    },
})

export default connect(null, mapDispatchToProps)(Favourites)