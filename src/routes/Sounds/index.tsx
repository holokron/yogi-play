import * as React from 'react'
import Container from '../../components/Container'
import Row from '../../components/Row'
import SoundsNav from '../../components/SoundsNav'
import SoundsContainer from '../../containers/SoundsContainer'
import SoundsPlayerContainer from '../../containers/SoundsPlayerContainer'
import SoundsRow from '../../components/SoundsRow'
import SoundNavItem from '../../components/SoundNavItem'
import Tag from '../../types/Tag'
import TabsContainer from '../../containers/TabsContainer'
import SoundsRepository from '../../lib/sounds-repository'
import TagsRepository from '../../lib/tags-repository'
import SoundPlayer from '../../types/SoundPlayer'

export default function Sounds(): React.ReactElement<{}> {
  return (
    <SoundsContainer>
      {(soundsRepository: SoundsRepository, tagsRepository: TagsRepository) => (
        <SoundsPlayerContainer sounds={soundsRepository.getSounds()}>
          {(soundPlayer: SoundPlayer) => (
            <TabsContainer initialTab={tagsRepository.getTagsByOrder()[0]}>
              {(currentTag: Tag | null, changeTab: {(tab: any): void}) => (
                <Container fluid>
                  <Row>
                    <SoundsNav>
                      {tagsRepository.getTagsByOrder().map((tag: Tag) => ( 
                        (tag.sounds || ['all', 'misc', 'recent'].includes(tag.slug)) && 
                        <SoundNavItem
                          key={tag.id}
                          onClick={() => changeTab(tag)}
                          isActive={!!currentTag && currentTag.id === tag.id}
                        >
                          {tag.name}
                        </SoundNavItem>
                      ))}
                    </SoundsNav>
                  </Row>
                  <SoundsRow
                    sounds={soundsRepository.getSoundsForTag(currentTag)}
                    playAudio={soundPlayer.playAudio}
                    stopAudio={soundPlayer.stopAudio}
                    isPlaying={soundPlayer.isPlaying}
                    addSoundStateListener={soundPlayer.addSoundStateListener}
                  />
                </Container>
              )}
            </TabsContainer>
          )}
        </SoundsPlayerContainer>
      )}
    </SoundsContainer>
  )
}