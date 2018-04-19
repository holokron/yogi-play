import * as React from 'react'
import Container from '../../components/Container'
import Row from '../../components/Row'
import SoundsNav from '../../components/SoundsNav'
import SoundsContainer from '../../containers/SoundsContainer'
import SoundsPlayerContainer from '../../containers/SoundsPlayerContainer'
import SoundsRow from '../../components/SoundsRow'
import Tag from '../../types/Tag'
import TabsContainer from '../../containers/TabsContainer'
import SoundsRepository from '../../lib/sounds-repository'
import TagsRepository from '../../lib/tags-repository'
import SoundPlayer from '../../types/SoundPlayer'
import DefaultTemplate from '../../templates/DefaultTemplate'

export default function Sounds(): React.ReactElement<{}> {
  return (
    <SoundsContainer>
      {(soundsRepository: SoundsRepository, tagsRepository: TagsRepository) => (
        <SoundsPlayerContainer sounds={soundsRepository.getSounds()}>
          {(soundPlayer: SoundPlayer) => (
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
                      playAudio={soundPlayer.playAudio}
                      stopAudio={soundPlayer.stopAudio}
                      isPlaying={soundPlayer.isPlaying}
                      addSoundStateListener={soundPlayer.addSoundStateListener}
                    />
                  </Container>
                </DefaultTemplate>
              )}
            </TabsContainer>
          )}
        </SoundsPlayerContainer>
      )}
    </SoundsContainer>
  )
}