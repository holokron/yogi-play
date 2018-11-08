import * as React from 'react'
import Container from '../../components/Container'
import Row from '../../components/Row'
import SoundsNav from '../../components/SoundsNav'
import SoundsRow from '../../components/SoundsRow'
import Tag from '../../types/Tag'
import TabsContainer from '../../containers/TabsContainer'
import DefaultTemplate from '../../templates/DefaultTemplate'
import TagsContainer from '../../containers/TagsContainer'

import SoundsForTagContainer from '../../containers/SoundsForTagContainer'
import Sound from '../../types/Sound'
import { AppDispatch, loadTags, loadSounds } from '../../store/actions'
import { connect } from 'react-redux'

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
      <TagsContainer>
        {(tags: Tag[]) => (
          <TabsContainer initialTab={tags[1]}>
            {(currentTag: Tag | null, changeTab: {(tab: any): void}) => (
              <DefaultTemplate>
                <Container fluid>
                  <Row>
                    <SoundsNav
                      currentTag={currentTag}
                      tags={tags
                        .filter((tag: Tag) => 
                          tag.sounds || ['all', 'misc', 'recent'].includes(tag.slug)
                        )}
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
        )}
      </TagsContainer>
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