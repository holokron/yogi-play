export default interface SoundState {
  soundId: string;
  isPlaying?: boolean;
  isLoading?: boolean;
}

export interface SoundStateCollection {
  [soundId: string]: SoundState;
}
