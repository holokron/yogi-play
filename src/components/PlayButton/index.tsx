import * as React from 'react'
import { Button } from 'reactstrap'

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

        let animationClass: string = ''

        if (isLoading) {
            animationClass += 'animated infinite flash'
        }

        if (isPlaying) {
            animationClass += 'animated infinite pulse active'
        }

        return {
            className: `play-btn btn-rounded text-truncate text-uppercase font-weight-bold ${animationClass}`,
            block: true,
            color: 'primary',
            outline: true,
            onClick,
            size: 'lg',
        }
    }

    render() {
        const {
            sound,
        } = this.props

        return (
            <Button
                {...this.getButtonProps()}
            >
                {sound.name}
            </Button>
        )
    }
}