import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import * as actions from "../store/actions";
import AppState from "../store/state";
import { hasUserSound } from "../store/selectors";
import { AppThunkDispatch } from "../store";

type UseUserSoundManager = {
  addUserSound: { (): void };
  removeUserSound: { (): void };
  isInUserSounds: boolean;
};

export default function useUserSoundManager(
  soundId: string
): UseUserSoundManager {
  const dispatch = useDispatch<AppThunkDispatch>();

  const addUserSound = useCallback((): void => {
    dispatch(actions.addUserSound(soundId));
  }, [dispatch, soundId]);

  const removeUserSound = useCallback((): void => {
    dispatch(actions.removeUserSound(soundId));
  }, [dispatch, soundId]);

  const isInUserSounds = useSelector<AppState, boolean>(
    (state: AppState): boolean => hasUserSound(state, soundId)
  );

  return {
    addUserSound,
    removeUserSound,
    isInUserSounds,
  };
}
