import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import Sound from "../types/Sound";
import * as actions from "../store/actions";
import AppState from "../store/state";
import { hasUserSound } from "../store/selectors";

type UseUserSoundManager = {
  addUserSound: { (): void };
  removeUserSound: { (): void };
  isInUserSounds: boolean;
};

export default function useUserSoundManager(sound: Sound): UseUserSoundManager {
  const dispatch = useDispatch();

  const addUserSound = useCallback((): void => {
    dispatch(actions.addUserSound(sound.id));
  }, [dispatch, sound]);

  const removeUserSound = useCallback((): void => {
    dispatch(actions.removeUserSound(sound.id));
  }, [dispatch, sound]);

  const isInUserSounds = useSelector<AppState, boolean>(
    (state: AppState): boolean => hasUserSound(state, sound.id)
  );

  return {
    addUserSound,
    removeUserSound,
    isInUserSounds
  };
}
