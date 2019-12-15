import React, { ReactElement } from "react";
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

export default function PlayButton({
  sound,
  onClick,
  onFavClick,
  isPlaying = false,
  isLoading = false,
  isFavourite = false
}: Props): ReactElement<Props> {
  let animationClass: string = "";

  if (isLoading) {
    animationClass += "animated infinite flash";
  }

  if (isPlaying) {
    animationClass += "animated infinite pulse active";
  }

  return (
    <ButtonGroup className={`play-btn d-flex ${animationClass}`} size="sm">
      <Button
        className="play-btn__play text-truncate text-uppercase font-weight-bold"
        color="primary"
        outline
        onClick={onClick}
      >
        {sound.name}
      </Button>
      <Button
        className="play-btn__fav"
        color="primary"
        outline={!isFavourite}
        onClick={onFavClick}
      >
        <FontAwesomeIcon icon="star" />
      </Button>
    </ButtonGroup>
  );
}
