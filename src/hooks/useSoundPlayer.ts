import { useSelector } from "react-redux";
import { useState } from "react";
import AppState from "../store/state";
import { getSound } from "../store/selectors";

type UseSoundPlayer = {
  playSound: { (): void };
  stopSound: { (): void };
  loadSound: { (): void };
  isPlaying: boolean;
  isLoading: boolean;
};

const audios: Map<string, HTMLAudioElement> = new Map<
  string,
  HTMLAudioElement
>();

function getAudio(id: string): HTMLAudioElement | undefined {
  return audios.get(id);
}

export default function useSoundPlayer(soundId: string): UseSoundPlayer {
  const sound = useSelector((state: AppState) => getSound(state, soundId));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    const audio = getAudio(soundId);

    return audio ? !audio.paused : false;
  });

  const loadSound = (): HTMLAudioElement | null => {
    let audio = getAudio(soundId);

    if (audio) {
      return audio;
    }

    if (!sound) {
      return null;
    }

    audio = new Audio(sound.path);
    audio.preload = "auto";
    audio.addEventListener("loadstart", (): void => {
      setIsLoading(true);
    });
    audio.addEventListener("loadeddata", (): void => {
      setIsLoading(false);
    });
    audio.addEventListener("ended", (): void => {
      setIsPlaying(false);
    });
    audio.addEventListener("pause", (): void => {
      setIsPlaying(false);
    });
    audio.addEventListener("playing", (): void => {
      setIsLoading(false);
    });

    audios.set(soundId, audio);

    return audio;
  };

  const playSound = (): void => {
    if (!sound) {
      return;
    }

    const audio = loadSound();

    if (!audio) {
      return;
    }

    audio.play();

    setIsPlaying(true);
  };

  const stopSound = (): void => {
    const audio = getAudio(soundId);

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    setIsPlaying(false);
  };

  return {
    playSound,
    stopSound,
    loadSound,
    isPlaying,
    isLoading
  };
}
