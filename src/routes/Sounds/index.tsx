import * as React from 'react'
import Container from '../../components/Container'
import Row from '../../components/Row'
import SoundsNav from '../../components/SoundsNav'
import SoundsContainer from '../../containers/SoundsContainer'
import SoundsRow from '../../components/SoundsRow'
import Tag from '../../types/Tag'
import TabsContainer from '../../containers/TabsContainer'
import SoundsRepository from '../../lib/sounds-repository'
import TagsRepository from '../../lib/tags-repository'
import DefaultTemplate from '../../templates/DefaultTemplate'

export default function Sounds(): React.ReactElement<{}> {
  return (
    <SoundsContainer>
      {(soundsRepository: SoundsRepository, tagsRepository: TagsRepository) => (
        <TabsContainer initialTab={tagsRepository.getTagsByOrder()[1]}>
          {(currentTag: Tag | null, changeTab: {(tab: any): void}) => (
            <DefaultTemplate>
              <Container fluid>
                <Row>
                  <SoundsNav
                    currentTag={currentTag}
                    tags={tagsRepository
                      .getTagsByOrder()
                      .filter((tag: Tag) => 
                        tag.sounds || ['all', 'misc', 'recent'].includes(tag.slug)
                      )}
                    changeTag={changeTab}
                  />
                </Row>
                <SoundsRow
                  sounds={soundsRepository.getSoundsForTag(currentTag)}
                />
              </Container>
            </DefaultTemplate>
          )}
        </TabsContainer>
      )}
    </SoundsContainer>
  )
}