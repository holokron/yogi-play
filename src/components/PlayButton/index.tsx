import * as React from 'react'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import Sound from '../../types/Sound'

export interface Props {
    sound: Sound
    onClick?: () => void
    isPlaying?: boolean
    isLoading?: boolean
}

export default class PlayButton extends React.PureComponent<Props, {}> {
    public static defaultProps: Partial<Props> = {
        isPlaying: false,
        isLoading: false,
    }

    getButtonProps(): object {
        const {
            isLoading,
            isPlaying,
            onClick,
        } = this.props

        return {
            className: 'play-btn btn-rounded text-left text-truncate',
            size: 'lg',
            block: true,
            color: 'primary',
            outline: !isPlaying && !isLoading,
            onClick,
        }
    }

    renderIcon() {
        const {
            isPlaying,
            isLoading,
        } = this.props

        if (isPlaying) {
            return <FontAwesomeIcon icon="pause" fixedWidth />
        }

        if (isLoading) {
            return <FontAwesomeIcon icon="spinner" fixedWidth pulse />
        }

        return <FontAwesomeIcon icon="play" fixedWidth />
    }

    render() {
        const {
            sound,
        } = this.props

        return (
            <Button
                {...this.getButtonProps()}
                className="play-btn btn-rounded text-left text-truncate"
            >
                {this.renderIcon()} {sound.name}
            </Button>
        )
    }
}