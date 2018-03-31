import Sound from './Sound'
import SoundStateListener from './SoundStateListener'

export default interface AddSoundStateListenerCallback {
    (sound: Sound, listener: SoundStateListener): void
}