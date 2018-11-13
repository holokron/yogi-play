import * as React from 'react'
import { connect } from 'react-redux'
import Container from '../../components/Container'
import Row from '../../components/Row'
import DefaultTemplate from '../../templates/DefaultTemplate'
import { AppDispatch, loadTags, loadSounds } from '../../store/actions'
import SoundsNavContainer from '../../containers/SoundsNavContainer'
import SoundsRowContainer from '../../containers/SoundsRowContainer'

export interface Props {
  loadTags: () => {}
  loadSounds: () => {}
}

class Sounds extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.loadTags()
    this.props.loadSounds()
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
})

export default connect(null, mapDispatchToProps)(Sounds)