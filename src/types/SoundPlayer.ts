import SoundCallback from './SoundCallback'
import AddSoundStateListenerCallback from './AddSoundStateListenerCallback'

export default interface SoundPlayer {    
    playAudio: SoundCallback<void>,
    stopAudio: SoundCallback<void>,
    isPlaying: SoundCallback<boolean>,
    addSoundStateListener: AddSoundStateListenerCallback,
}