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
                    lg="2"
                    md="3"
                    sm="4"
                    className="mb-3 pl-2 pr-2"
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