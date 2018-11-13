import { Action } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import * as firebase from 'firebase'
import AppState from './state'
import audioProvider from '../lib/audio-provider'
import database from '../lib/database'
import { getSound } from './selectors'
import Sound from '../types/Sound'
import SoundsCollection from '../types/SoundsCollection'
import TagsCollection from '../types/TagsCollection'

export enum ACTIONS {
    PLAY_SOUND = '@app/PLAY_SOUND',
    STOP_SOUND = '@app/STOP_SOUND',
    LOAD_SOUND = '@app/LOAD_SOUND',
    LOAD_SOUNDS = '@app/LOAD_SOUNDS',
    LOAD_TAGS = '@app/LOAD_TAGS',
    CHOOSE_TAG = '@app/CHOOSE_TAG',
}

const audios: Map<string, HTMLAudioElement> = new Map<string, HTMLAudioElement>()

export interface SoundAction extends Action<ACTIONS> {
    payload: {
        soundId: string
    }
}

export interface LoadSoundsAction extends Action<ACTIONS> {
    payload: {
        sounds: SoundsCollection
    },
}

export interface LoadTagsAction extends Action<ACTIONS> {
    payload: {
        tags: TagsCollection
    },
}

export interface ChooseTagAction extends Action<ACTIONS> {
    payload: {
        tagSlug: string
    },
}

export type AppAction = SoundAction & LoadSoundsAction & LoadTagsAction & ChooseTagAction

export type AppDispatch = ThunkDispatch<AppState, any, AppAction>

export function createPlaySoundAction(soundId: string): SoundAction {
    return {
        type: ACTIONS.PLAY_SOUND,
        payload: {
            soundId,
        },
    }
}

export function createStopSoundAction(soundId: string): SoundAction {
    return {
        type: ACTIONS.STOP_SOUND,
        payload: {
            soundId,
        },
    }
}

export function createLoadSoundAction(soundId: string) {
    return {
        type: ACTIONS.LOAD_SOUND,
        payload: {
            soundId,
        },
    }
}

export function createLoadSoundsAction(sounds: SoundsCollection): LoadSoundsAction {
    return {
        type: ACTIONS.LOAD_SOUNDS,
        payload: {
            sounds,
        },
    }
}

export function createLoadTagsAction(tags: TagsCollection): LoadTagsAction {
    return {
        type: ACTIONS.LOAD_TAGS,
        payload: {
            tags,
        },
    }
}

export function createChooseTagAction(tagSlug: string): ChooseTagAction {
    return {
        type: ACTIONS.CHOOSE_TAG,
        payload: {
            tagSlug,
        },
    }
}

export function playSound(soundId: string): ThunkAction<void, AppState, any, SoundAction> {
    return async (dispatch, getState) => {
        const sound: Sound | null = getSound(getState(), soundId)

        if (!sound) {
            return
        }

        let audio: HTMLAudioElement | undefined = audios.get(soundId)

        if (!audio) {                
            const soundSrc: string = await audioProvider.getAudio(sound.path)
            audio = new Audio(soundSrc)
            audio.preload = 'auto'
            audio.addEventListener('loadstart', (): void => {
                dispatch(createLoadSoundAction(soundId))
            })
            audio.addEventListener('ended', (): void => {
                dispatch(createStopSoundAction(soundId))
            })
            audio.addEventListener('pause', (): void => {
                dispatch(createStopSoundAction(soundId))
            })
            audio.addEventListener('playing', (): void => {
                dispatch(createPlaySoundAction(soundId))
            })

            audios.set(soundId, audio)
        }

        audio.play()
    }
}

export function stopSound(soundId: string):  ThunkAction<void, AppState, any, SoundAction> {
    return (dispatch) => {
        let audio: HTMLAudioElement | undefined = audios.get(soundId)

        if (!audio) {
            return
        }

        audio.pause()
        audio.currentTime = 0

        dispatch(createStopSoundAction(soundId))
    }
}

export function loadSounds(): ThunkAction<void, AppState, any, LoadSoundsAction> {
    return (dispatch) => {        
        database.getSoundsRef()
            .on(
                'value',
                (snapshot: firebase.database.DataSnapshot) => {
                    dispatch(createLoadSoundsAction(snapshot.val()))
                }
            )
    }
}

export function loadTags(): ThunkAction<void, AppState, any, LoadTagsAction> {
    return (dispatch) => {
        database.getTagsRef()
            .on(
                'value',
                (snapshot: firebase.database.DataSnapshot) => {
                    dispatch(createLoadTagsAction(snapshot.val()))
                }
            )
    }
}

export function chooseTag(tagSlug: string): ThunkAction<void, AppState, any, ChooseTagAction> {
    return (dispatch) => {
        dispatch(createChooseTagAction(tagSlug))
    }
}

export function readText(text: string): ThunkAction<void, AppState, any, any> {
    return () => {
        if (!speechSynthesis) {
            return
        }

        const speech: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text)
        speech.rate = 0.7
        speechSynthesis.speak(speech)
    }
}