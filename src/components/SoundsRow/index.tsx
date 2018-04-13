import * as React from 'react'
import { Col } from 'reactstrap'
import Row from '../../components/Row'
import PlayButtonContainer from '../../containers/PlayButtonContainer'
import Sound from '../../types/Sound'
import SoundCallback from '../../types/SoundCallback'
import AddSoundStateListenerCallback from '../../types/AddSoundStateListenerCallback'

export interface Props {
    sounds: Sound[],
    playAudio: SoundCallback<any>
    stopAudio: SoundCallback<any>
    isPlaying: SoundCallback<boolean>
    addSoundStateListener: AddSoundStateListenerCallback
}

export default function SoundsRow({
    sounds,
    playAudio,
    stopAudio,
    isPlaying,
    addSoundStateListener,
 }: Props): React.ReactElement<Props> {
    return (
        <Row withTopPadding>
            {sounds.map((sound: Sound) => (
                <Col
                    xl="1"
                    lg="2"
                    md="2"
                    sm="4"
                    xs="6"
                    className="mb-2 pl-1 pr-1"
                    key={sound.name}
                >
                    <PlayButtonContainer
                        sound={sound}
                        playAudio={playAudio}
                        stopAudio={stopAudio}
                        isPlaying={isPlaying(sound)}
                        addSoundStateListener={addSoundStateListener}
                    />
                </Col>
            ))}
        </Row>
    )
}