import * as React from 'react'
import { connect } from 'react-redux'
import Container from '../../components/Container'
import DefaultTemplate from '../../templates/DefaultTemplate'
import { AppDispatch, loadSounds, authenticate } from '../../store/actions'
import UserSoundsContainer from '../../containers/UserSoundsContainer'
import Sound from '../../types/Sound'
import SoundsRow from '../../components/SoundsRow'
import SoundsNavHeader from '../../components/SoundsNavHeader'
import Row from '../../components/Row'

interface DispatchProps {
  loadSounds: () => {}
  authenticate: () => {}
}

export type Props = DispatchProps

class Sounds extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.loadSounds()
    this.props.authenticate()
  }

  public render() {
    return (
      <DefaultTemplate>
        <Container fluid>
          <Row>
            <SoundsNavHeader>
                Ulubione
            </SoundsNavHeader>  
          </Row>
          <UserSoundsContainer>
              {(sounds: Sound[]) => <SoundsRow sounds={sounds}/>}
          </UserSoundsContainer>
        </Container>
      </DefaultTemplate>
    )
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  loadSounds: async (): Promise<void> => {
    dispatch(loadSounds())
  },
  authenticate: async (): Promise<void> => {
    dispatch(authenticate())
  },
})

export default connect<{}, DispatchProps, {}>(null, mapDispatchToProps)(Sounds)