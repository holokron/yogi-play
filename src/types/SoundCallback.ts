import Sound from './Sound'

export default interface SoundCallback<T> {
    (sound: Sound): T
}