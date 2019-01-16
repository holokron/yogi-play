import * as React from 'react'
import { connect } from 'react-redux'
import Sound from '../types/Sound'
import PlayButton from '../components/PlayButton'
import { AppDispatch, playSound, stopSound, addUserSound, removeUserSound } from '../store/actions'
import AppState from '../store/state'
import { hasUserSound } from '../store/selectors'

interface OwnProps {
    sound: Sound
}

interface StateProps {
    isInUserSounds: boolean
}

interface DispatchProps {
    playSound: {(soundId: string): void}
    stopSound: {(soundId: string): void}
    addUserSound: {(soundId: string): void}
    removeUserSound: {(soundId: string): void}
}

type Props = OwnProps & StateProps & DispatchProps

class PlayButtonContainer extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props)

        this.onClick = this.onClick.bind(this)
        this.onClickFavourites = this.onClickFavourites.bind(this)
    }

    public render() {
        const {
            onClick,
            onClickFavourites,
            props: {
                sound,
                isInUserSounds,
            },
        } = this

        return (
            <PlayButton 
                sound={sound} 
                onClick={onClick} 
                isLoading={sound.isLoading} 
                isPlaying={sound.isPlaying} 
                onFavClick={onClickFavourites}
                isFavourite={isInUserSounds}
            />
        )
    }

    public onClick() {
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

    public onClickFavourites() {
        if (this.props.isInUserSounds) {
            this.props.removeUserSound(this.props.sound.id)
        } else {
            this.props.addUserSound(this.props.sound.id)
        }
    }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
    isInUserSounds: hasUserSound(state, ownProps.sound.id)
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    playSound: (soundId: string): void => {
        dispatch(playSound(soundId))
    },
    stopSound: (soundId: string): void => {
        dispatch(stopSound(soundId))
    },
    addUserSound: (soundId: string): void => {
        dispatch(addUserSound(soundId))
    },
    removeUserSound: (soundId: string): void => {
        dispatch(removeUserSound(soundId))
    }
})

export default connect<StateProps, DispatchProps, OwnProps, AppState>
    (mapStateToProps, mapDispatchToProps)(PlayButtonContainer)