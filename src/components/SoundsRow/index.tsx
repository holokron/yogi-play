import * as React from 'react'
import { Col } from 'reactstrap'
import Row from '../../components/Row'
import PlayButtonContainer from '../../containers/PlayButtonContainer'
import Sound from '../../types/Sound'

export interface Props {
    sounds: Sound[]
}

export default function SoundsRow({
    sounds,
 }: Props): React.ReactElement<Props> {
    return (
        <Row withTopPadding>
            {sounds.map((sound: Sound) => (
                <Col
                    xl="2"
                    lg="2"
                    md="3"
                    sm="4"
                    xs="6"
                    className="mb-2 pl-1 pr-1"
                    key={sound.name}
                >
                    <PlayButtonContainer
                        sound={sound}
                    />
                </Col>
            ))}
        </Row>
    )
}