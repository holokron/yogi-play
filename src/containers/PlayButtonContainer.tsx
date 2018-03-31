import * as React from 'react'
import Sound from '../types/Sound'
import SoundCallback from '../types/SoundCallback'
import PlayButton from '../components/PlayButton'
import AddSoundStateListenerCallback from '../types/AddSoundStateListenerCallback'

export interface Props {
    sound: Sound
    playAudio: SoundCallback<void>,
    stopAudio: SoundCallback<void>,
    isPlaying?: boolean,
    addSoundStateListener: AddSoundStateListenerCallback
}

export interface State {
    isPlaying: boolean
    isLoading: boolean
}

export default class PlayButtonContainer extends React.PureComponent<Props, State> {
    static defaultProps: Partial<Props> = {
        isPlaying: false,
    }

    private mounted: boolean = false

    constructor(props: Props) {
        super(props)

        this.state = {
            isPlaying: props.isPlaying || false,
            isLoading: false,
        }

        this.onClick = this.onClick.bind(this)
        this.isPlaying = this.isPlaying.bind(this)
    }

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
        this.props.addSoundStateListener(
            this.props.sound,
            (sound: Sound, isPlaying: boolean): void => {
                if (!this.mounted) {
                    return
                }
                
                this.setState({
                    isPlaying,
                    isLoading: false,
                })
            })
    }

    isPlaying(): boolean {
        return this.state.isPlaying
    }

    onClick() {
        const {
            playAudio,
            stopAudio,
            sound,
        } = this.props

        if (this.state.isLoading) {
            return
        }

        this.setState({
            isLoading: true,
        })

        if (this.isPlaying()) {
            stopAudio(sound)

            return
        }

        playAudio(sound)       
    }

    render() {
        const {
            onClick,
            props: {
                sound,
            },
            state: {
                isPlaying,
                isLoading,
            },
        } = this

        return <PlayButton sound={sound} onClick={onClick} isLoading={isLoading} isPlaying={isPlaying} />
    }
}