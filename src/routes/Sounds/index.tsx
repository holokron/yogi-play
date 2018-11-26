import * as React from 'react'
import { connect } from 'react-redux'
import Container from '../../components/Container'
import Row from '../../components/Row'
import DefaultTemplate from '../../templates/DefaultTemplate'
import { AppDispatch, loadTags, loadSounds, authenticate } from '../../store/actions'
import SoundsNavContainer from '../../containers/SoundsNavContainer'
import SoundsRowContainer from '../../containers/SoundsRowContainer'

export interface Props {
  loadTags: () => {}
  loadSounds: () => {}
  authenticate: () => {}
}

class Sounds extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.loadTags()
    this.props.loadSounds()
    this.props.authenticate()
  }

  public render() {
    return (
      <DefaultTemplate>
        <Container fluid>
          <Row> 
            <SoundsNavContainer />
          </Row>
          <SoundsRowContainer />
        </Container>
      </DefaultTemplate>
    )
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  loadTags: async (): Promise<void> => {
    dispatch(loadTags())
  },
  loadSounds: async (): Promise<void> => {
    dispatch(loadSounds())
  },
  authenticate: async (): Promise<void> => {
    dispatch(authenticate())
  },
})

export default connect(null, mapDispatchToProps)(Sounds)