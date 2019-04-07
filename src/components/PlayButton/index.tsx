import * as React from 'react'
import Button from 'reactstrap/lib/Button'
import ButtonGroup from 'reactstrap/lib/ButtonGroup'
import './index.css'
import Sound from '../../types/Sound'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Col from 'reactstrap/lib/Col';

interface ButtonWrapperProps {
    children: React.ReactNode
}

const ButtonWrapper: React.FunctionComponent<ButtonWrapperProps> = React.memo(({ children }: ButtonWrapperProps) => (
    <Col
        xl="2"
        lg="2"
        md="3"
        sm="4"
        xs="6"
        className="mb-2 pl-1 pr-1"
    >
        {children}
    </Col>
))

export interface Props {
    sound: Sound
    onClick?: () => void
    onFavClick?: () => void
    isPlaying?: boolean
    isLoading?: boolean
    isFavourite?: boolean
}

export default class PlayButton extends React.PureComponent<Props, {}> {
    public static defaultProps: Partial<Props> = {
        isPlaying: false,
        isLoading: false,
        isFavourite: false,
    }

    public renderPlayButton() {
        const {
            sound,
        } = this.props

        return (
            <Button {...this.getPlayButtonProps()}>
                {sound.name}
            </Button>
        )
    }

    public renderFavouriteButton() {
        return (
            <Button {...this.getFavButtonProps()}>
                <FontAwesomeIcon icon="star" />
            </Button>
        )
    }

    public render() {
        return (
            <ButtonWrapper>
                <ButtonGroup {...this.getButtonGroupProps()}>
                    {this.renderPlayButton()}
                    {this.renderFavouriteButton()}
                </ButtonGroup>
            </ButtonWrapper>
        )
    }

    private getButtonGroupProps(): object {
        const {
            isLoading,
            isPlaying,
        } = this.props

        let animationClass: string = ''

        if (isLoading) {
            animationClass += 'animated infinite flash'
        }

        if (isPlaying) {
            animationClass += 'animated infinite pulse active'
        }

        return {
            className: `play-btn d-flex ${animationClass}`,
            size: 'sm',
        }
    }

    private getPlayButtonProps(): object {
        const {
            onClick,
        } = this.props

        return {
            className: 'play-btn__play text-truncate text-uppercase font-weight-bold',
            color: 'primary',
            outline: true,
            onClick,
        }
    }

    private getFavButtonProps(): object {
        const {
            isFavourite,
            onFavClick,
        } = this.props

        return {
            className: 'play-btn__fav',
            color: 'primary',
            outline: !isFavourite,
            onClick: onFavClick,
        }
    }
}