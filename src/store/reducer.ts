import AppState, { initialState } from './state'
import { ACTIONS, AppAction } from './actions'

export default function appReducer(state: AppState = initialState, action: AppAction): AppState {
    switch (action.type) {
    case ACTIONS.PLAY_SOUND:
        return {
            ...state,
            sounds: {
                ...state.sounds,
                [action.payload.soundId]: {
                    ...state.sounds[action.payload.soundId],
                    isPlaying: true,
                    isLoading: false,
                },
            },
        }
    case ACTIONS.STOP_SOUND:
        return {
            ...state,
            sounds: {
                ...state.sounds,
                [action.payload.soundId]: {
                    ...state.sounds[action.payload.soundId],
                    isPlaying: false,
                    isLoading: false,
                },
            },
        }
    case ACTIONS.LOAD_SOUND:
        return {
            ...state,
            sounds: {
                ...state.sounds,
                [action.payload.soundId]: {
                    ...state.sounds[action.payload.soundId],
                    isLoading: true,
                },
            },
        }    
    case ACTIONS.LOAD_SOUNDS:
        return {
            ...state,
            sounds: {
                ...state.sounds,
                ...action.payload.sounds,
            },
        }
    case ACTIONS.LOAD_TAGS:
        return {
            ...state,
            tags: {
                ...state.tags,
                ...action.payload.tags,
            },
        }
    default:
        return state
    }
}