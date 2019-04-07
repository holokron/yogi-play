import * as React from 'react'
import Row from '../../components/Row'
import PlayButtonContainer from '../../containers/PlayButtonContainer'
import Sound from '../../types/Sound'

export interface Props {
    sounds: Sound[]
}

function SoundsRow({
    sounds,
 }: Props): React.ReactElement<Props> {
    return (
        <Row withTopPadding>
            {sounds.map((sound: Sound) => (
                <PlayButtonContainer key={sound.name} sound={sound} />
            ))}
        </Row>
    )
}

export default React.memo(SoundsRow)