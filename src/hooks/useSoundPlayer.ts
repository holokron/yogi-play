import { useDispatch } from "react-redux";
import { useCallback } from "react";
import Sound from "../types/Sound";
import * as actions from "../store/actions";

type UseSoundPlayer = {
  playSound: { (): void };
  stopSound: { (): void };
};

export default function useSoundPlayer(sound: Sound): UseSoundPlayer {
  const dispatch = useDispatch();

  const playSound = useCallback((): void => {
    dispatch(actions.playSound(sound.id));
  }, [dispatch, sound]);

  const stopSound = useCallback((): void => {
    dispatch(actions.stopSound(sound.id));
  }, [dispatch, sound]);

  return {
    playSound,
    stopSound
  };
}
