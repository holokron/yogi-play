import * as React from "react";
import Button from "reactstrap/lib/Button";
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import "./index.css";
import Sound from "../../types/Sound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface Props {
  sound: Sound;
  onClick?: () => void;
  onFavClick?: () => void;
  isPlaying?: boolean;
  isLoading?: boolean;
  isFavourite?: boolean;
}

export default class PlayButton extends React.PureComponent<Props> {
  public static defaultProps: Partial<Props> = {
    isPlaying: false,
    isLoading: false,
    isFavourite: false
  };

  public renderPlayButton() {
    const { sound } = this.props;

    return <Button {...this.getPlayButtonProps()}>{sound.name}</Button>;
  }

  public renderFavouriteButton() {
    return (
      <Button {...this.getFavButtonProps()}>
        <FontAwesomeIcon icon="star" />
      </Button>
    );
  }

  public render() {
    return (
      <ButtonGroup {...this.getButtonGroupProps()}>
        {this.renderPlayButton()}
        {this.renderFavouriteButton()}
      </ButtonGroup>
    );
  }

  private getButtonGroupProps(): object {
    const { isLoading, isPlaying } = this.props;

    let animationClass: string = "";

    if (isLoading) {
      animationClass += "animated infinite flash";
    }

    if (isPlaying) {
      animationClass += "animated infinite pulse active";
    }

    return {
      className: `play-btn d-flex ${animationClass}`,
      size: "sm"
    };
  }

  private getPlayButtonProps(): object {
    const { onClick } = this.props;

    return {
      className: "play-btn__play text-truncate text-uppercase font-weight-bold",
      color: "primary",
      outline: true,
      onClick
    };
  }

  private getFavButtonProps(): object {
    const { isFavourite, onFavClick } = this.props;

    return {
      className: "play-btn__fav",
      color: "primary",
      outline: !isFavourite,
      onClick: onFavClick
    };
  }
}
