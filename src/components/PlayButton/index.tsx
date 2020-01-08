import React, { ReactElement } from "react";
import Button from "reactstrap/lib/Button";
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSoundPlayer from "../../hooks/useSoundPlayer";
import useUserSoundManager from "../../hooks/useUserSoundManager";
import { useSelector } from "react-redux";
import { getSound } from "../../store/selectors";
import AppState from "../../store/state";

export interface Props {
  soundId: string;
}

function PlayButton({ soundId }: Props): ReactElement<Props> | null {
  const { playSound, stopSound, loadSound, isPlaying } = useSoundPlayer(
    soundId
  );

  const { addUserSound, removeUserSound, isInUserSounds } = useUserSoundManager(
    soundId
  );

  const handleClickPlay = (): void => {
    if (isPlaying) {
      stopSound();

      return;
    }

    playSound();
  };

  const handleClickFavourites = (): void => {
    if (isInUserSounds) {
      removeUserSound();
    } else {
      addUserSound();
    }
  };

  const onMouseEnter = () => {
    loadSound();
  };

  let animationClass: string = "";

  if (isPlaying) {
    animationClass += "animated infinite pulse active";
  }

  const sound = useSelector((state: AppState) => getSound(state, soundId));

  if (!sound) {
    return null;
  }

  return (
    <ButtonGroup
      onMouseEnter={onMouseEnter}
      className={`play-btn d-flex ${animationClass}`}
      size="sm"
    >
      <Button
        name={sound.name}
        className="play-btn__play text-truncate text-uppercase font-weight-bold"
        color="primary"
        outline
        onClick={handleClickPlay}
      >
        {sound.name}
      </Button>
      <Button
        name={isInUserSounds ? "Dodaj do ulubionych" : "Usuń z ulubionych"}
        className="play-btn__fav"
        color="primary"
        outline={!isInUserSounds}
        onClick={handleClickFavourites}
      >
        <FontAwesomeIcon icon="star" />
      </Button>
    </ButtonGroup>
  );
}

export default PlayButton;
