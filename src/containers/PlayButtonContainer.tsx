import * as React from 'react'
import Sound from '../types/Sound'
import PlayButton from '../components/PlayButton'

export interface Props {
    sound: Sound
    isPlaying?: boolean,
}

export interface State {
    isPlaying: boolean
    isLoading: boolean
}

export default class PlayButtonContainer extends React.PureComponent<Props, State> {
    static defaultProps: Partial<Props> = {
        isPlaying: false,
    }

    constructor(props: Props) {
        super(props)

        this.state = {
            isPlaying: props.isPlaying || false,
            isLoading: false,
        }

        this.onClick = this.onClick.bind(this)
        this.isPlaying = this.isPlaying.bind(this)
    }

    isPlaying(): boolean {
        return this.state.isPlaying
    }

    onClick() {
        if (this.state.isLoading) {
            return
        }

        this.setState({
            isLoading: true,
        })     
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