import Sound from './Sound'

export default interface SoundStateListener {
    (sound: Sound, isPlaying: boolean): void
}