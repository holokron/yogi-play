import * as React from 'react'
import Sound from '../types/Sound'
import SoundClip from '../types/SoundClip'
import SoundPlayer from '../types/SoundPlayer'
import SoundStateListener from '../types/SoundStateListener'
import audioProvider from '../lib/audio-provider'

export interface Props {
    children: {(soundPlayer: SoundPlayer): React.ReactElement<any>}
    sounds?: Sound[]
}

export default class SoundsPlayerContainer extends React.PureComponent<Props> {
    private soundClips: Map<string, SoundClip> = new Map<string, SoundClip>()

    private listeners: Map<string, SoundStateListener> = new Map<string, SoundStateListener>()

    constructor(props: Props) {
        super(props)
        this.getSoundClip = this.getSoundClip.bind(this)
        this.hasSoundClip = this.hasSoundClip.bind(this)
        this.onIsPlaying = this.onIsPlaying.bind(this)
        this.onEndedPlaying = this.onEndedPlaying.bind(this)
        this.initSoundClip = this.initSoundClip.bind(this)
        this.initSounds = this.initSounds.bind(this)
        this.playAudio = this.playAudio.bind(this)
        this.stopAudio = this.stopAudio.bind(this)
        this.isPlaying = this.isPlaying.bind(this)
        this.addSoundStateListener = this.addSoundStateListener.bind(this)
        this.dispatchStateChengeEvent = this.dispatchStateChengeEvent.bind(this)
    }

    componentDidMount() {
        if (!this.props.sounds) {
            return
        }

        this.initSounds(this.props.sounds)
    }

    componentWillReceiveProps(nextProps: Props): void {
        this.initSounds(nextProps.sounds || [])
    }

    addSoundStateListener(sound: Sound, listener: SoundStateListener): void {
        this.listeners.set(sound.id, listener)
    }

    playAudio(sound: Sound): void {
        const soundClip = this.getSoundClip(sound)

        if (!soundClip) {
            this.initSoundClip(sound)
                .then((clip: SoundClip) => {
                    clip.audio.play()
                })

            return
        }

        if (soundClip.isPlaying) {
            return
        }

        soundClip.audio.play()
    }

    stopAudio(sound: Sound): void {
        const soundClip = this.getSoundClip(sound)
        if (!soundClip) {
            return
        }

        soundClip.audio.pause()
        soundClip.audio.currentTime = 0
    }

    isPlaying(sound: Sound): boolean {
        const soundClip = this.getSoundClip(sound)
        if (!soundClip) {
            return false
        }

        return soundClip.isPlaying
    }

    render() {
        const {
            playAudio,
            stopAudio,
            isPlaying,
            addSoundStateListener,
            props: {
                children,
            },
        } = this

        return children({
            playAudio,
            stopAudio,
            isPlaying,
            addSoundStateListener,
        })
    }

    private async initSounds(sounds: Sound[]): Promise<void> {
        sounds.forEach((sound: Sound) => {
            if (!this.getSoundClip(sound)) {
                this.initSoundClip(sound)
            }
        })
    }

    private async initSoundClip(sound: Sound): Promise<SoundClip> {
        const audio: HTMLAudioElement = await audioProvider.getAudio(sound.path)

        audio.preload = 'metadata'
        audio.addEventListener('ended', (): void => this.onEndedPlaying(sound))
        audio.addEventListener('pause', (): void => this.onEndedPlaying(sound))
        audio.addEventListener('playing', (): void => this.onIsPlaying(sound))

        const soundClip: SoundClip = {
            sound,
            audio,
            isPlaying: false,
        }

        this.soundClips.set(sound.id, soundClip)

        return soundClip      
    }

    private onIsPlaying(sound: Sound): void {
        const soundClip = this.getSoundClip(sound)
        if (!soundClip) {
            return
        }

        soundClip.isPlaying = true

        this.dispatchStateChengeEvent(sound, true)
    }

    private onEndedPlaying(sound: Sound): void {
        const soundClip = this.getSoundClip(sound)
        if (!soundClip) {
            return
        }

        soundClip.isPlaying = false

        this.dispatchStateChengeEvent(sound, false)
    }

    private dispatchStateChengeEvent(sound: Sound, isPlaying: boolean): void {
        const listener = this.listeners.get(sound.id)
        if (!listener) {
            return
        }

        listener(sound, isPlaying)
    }

    private hasSoundClip(sound: Sound): boolean {
        return this.soundClips.has(sound.id)
    }

    private getSoundClip(sound: Sound): SoundClip | null {
        return this.soundClips.get(sound.id) || null
    } 
}