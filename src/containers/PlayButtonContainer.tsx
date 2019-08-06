import React, { useCallback } from "react";
import Sound from "../types/Sound";
import PlayButton from "../components/PlayButton";
import useSoundPlayer from "../hooks/useSoundPlayer";
import useUserSoundManager from "../hooks/useUserSoundManager";

interface Props {
  sound: Sound;
}

export default function PlayButtonContainer({
  sound
}: Props): React.ReactElement<Props> {
  const { playSound, stopSound } = useSoundPlayer(sound);

  const { addUserSound, removeUserSound, isInUserSounds } = useUserSoundManager(
    sound
  );

  const handleClickPlay = useCallback((): void => {
    if (sound.isLoading) {
      return;
    }

    if (sound.isPlaying) {
      stopSound();

      return;
    }

    playSound();
  }, [sound, playSound, stopSound]);

  const handleClickFavourites = useCallback((): void => {
    if (isInUserSounds) {
      removeUserSound();
    } else {
      addUserSound();
    }
  }, [isInUserSounds, addUserSound, removeUserSound]);

  return (
    <PlayButton
      sound={sound}
      onClick={handleClickPlay}
      isLoading={sound.isLoading}
      isPlaying={sound.isPlaying}
      onFavClick={handleClickFavourites}
      isFavourite={isInUserSounds}
    />
  );
}
