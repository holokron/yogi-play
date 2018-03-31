import Sound from './Sound'

export default interface SoundClip {
    sound: Sound
    audio: HTMLAudioElement
    isPlaying: boolean
}