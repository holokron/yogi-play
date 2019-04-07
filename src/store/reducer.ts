import AppState, { initialState } from "./state";
import { ACTIONS, AppAction } from "./actions";

export default function appReducer(
  state: AppState = initialState,
  action: AppAction
): AppState {
  switch (action.type) {
    case ACTIONS.PLAY_SOUND:
      return {
        ...state,
        soundStates: {
          ...state.soundStates,
          [action.payload.soundId]: {
            ...state.soundStates[action.payload.soundId],
            soundId: action.payload.soundId,
            isPlaying: true,
            isLoading: false
          }
        }
      };
    case ACTIONS.STOP_SOUND:
      return {
        ...state,
        soundStates: {
          ...state.soundStates,
          [action.payload.soundId]: {
            ...state.soundStates[action.payload.soundId],
            soundId: action.payload.soundId,
            isPlaying: false,
            isLoading: false
          }
        }
      };
    case ACTIONS.LOAD_SOUND:
      return {
        ...state,
        sounds: {
          ...state.sounds,
          [action.payload.soundId]: {
            ...state.sounds[action.payload.soundId],
            isLoading: true
          }
        }
      };
    case ACTIONS.LOAD_SOUNDS:
      return {
        ...state,
        sounds: {
          ...state.sounds,
          ...action.payload.sounds
        }
      };
    case ACTIONS.LOAD_TAGS:
      return {
        ...state,
        tags: {
          ...state.tags,
          ...action.payload.tags
        }
      };
    case ACTIONS.CHOOSE_TAG:
      return {
        ...state,
        chosenTagSlug: action.payload.tagSlug
      };
    case ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user
      };
    case ACTIONS.ADD_USER_SOUND:
      return {
        ...state,
        user: {
          ...state.user,
          sounds: {
            ...state.user.sounds,
            [action.payload.soundId]: true
          }
        }
      };
    default:
      return state;
  }
}
