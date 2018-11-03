import * as React from 'react'
import { connect } from 'react-redux'
import Sound from '../types/Sound'
import PlayButton from '../components/PlayButton'
import { AppDispatch, playSound, stopSound } from '../store/actions'

export interface Props {
    sound: Sound
    playSound: {(soundId: string): void}
    stopSound: {(soundId: string): void}
}

class PlayButtonContainer extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props)

        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        const {
            sound,
        } = this.props

        if (sound.isLoading) {
            return
        }

        if (sound.isPlaying) {
            this.props.stopSound(sound.id)

            return
        }

        this.props.playSound(sound.id)
    }

    render() {
        const {
            onClick,
            props: {
                sound,
            },
        } = this

        return <PlayButton sound={sound} onClick={onClick} isLoading={sound.isLoading} isPlaying={sound.isPlaying} />
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    playSound: (soundId: string): void => {
        dispatch(playSound(soundId))
    },
    stopSound: (soundId: string): void => {
        dispatch(stopSound(soundId))
    },
})

export default connect(null, mapDispatchToProps)(PlayButtonContainer)