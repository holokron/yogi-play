import { useCallback } from "react";
import { useAppStore } from "@/store";
import { hasUserSound } from "@/store/selectors";

type UseUserSoundManager = {
  addUserSound: { (): void };
  removeUserSound: { (): void };
  isInUserSounds: boolean;
};

export default function useUserSoundManager(
  soundId: string,
): UseUserSoundManager {
  const add = useAppStore((state) => state.addUserSound);
  const remove = useAppStore((state) => state.removeUserSound);

  const addUserSound = useCallback((): void => add(soundId), [add, soundId]);

  const removeUserSound = useCallback(
    (): void => remove(soundId),
    [remove, soundId],
  );

  const isInUserSounds = useAppStore((state) => hasUserSound(state, soundId));

  return {
    addUserSound,
    removeUserSound,
    isInUserSounds,
  };
}
