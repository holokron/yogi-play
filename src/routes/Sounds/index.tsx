import * as React from 'react'
import Container from '../../components/Container'
import Row from '../../components/Row'
import SoundsNav from '../../components/SoundsNav'
import SoundsRow from '../../components/SoundsRow'
import Tag from '../../types/Tag'
import TabsContainer from '../../containers/TabsContainer'
import DefaultTemplate from '../../templates/DefaultTemplate'
import SoundsForTagContainer from '../../containers/SoundsForTagContainer'
import Sound from '../../types/Sound'
import { AppDispatch, loadTags, loadSounds } from '../../store/actions'
import { connect } from 'react-redux'
import AppState from 'src/store/state'
import { getTagsByOrder } from 'src/store/selectors'

export interface Props {
  loadTags: () => {}
  loadSounds: () => {}
  tags: Tag[]
}

class Sounds extends React.PureComponent<Props> {
  static readonly defaultProps: Partial<Props> = {
    tags: [],
  }

  public componentDidMount() {
    this.props.loadTags()
    this.props.loadSounds()
  }

  public render() {
    const {
      tags,
    } = this.props

    return (
      <TabsContainer initialTab={tags[1]}>
        {(currentTag: Tag | null, changeTab: {(tab: any): void}) => (
          <DefaultTemplate>
            <Container fluid>
              <Row>
                <SoundsNav
                  currentTag={currentTag}
                  tags={tags}
                  changeTag={changeTab}
                />
              </Row>
              <SoundsForTagContainer tag={currentTag}>
                {(sounds: Sound[]) => (
                  <SoundsRow
                    sounds={sounds}
                  />                    
                )}
              </SoundsForTagContainer>
            </Container>
          </DefaultTemplate>
        )}
      </TabsContainer>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  tags: getTagsByOrder(state),
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  loadTags: async (): Promise<void> => {
    dispatch(loadTags())
  },
  loadSounds: async (): Promise<void> => {
    dispatch(loadSounds())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Sounds)