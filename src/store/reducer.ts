import AppState, { initialState } from "./state";
import { ACTIONS, AppAction } from "./actions";

export default function appReducer(
  state: AppState = initialState,
  action: AppAction,
): AppState {
  switch (action.type) {
    case ACTIONS.LOAD_SOUNDS:
      return {
        ...state,
        sounds: {
          ...state.sounds,
          ...action.payload.sounds,
        },
      };
    case ACTIONS.LOAD_TAGS:
      return {
        ...state,
        tags: {
          ...state.tags,
          ...action.payload.tags,
        },
      };
    case ACTIONS.CHOOSE_TAG:
      return {
        ...state,
        chosenTagSlug: action.payload.tagSlug,
      };
    case ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case ACTIONS.ADD_USER_SOUND:
      return {
        ...state,
        user: {
          ...state.user,
          sounds: {
            ...state.user?.sounds,
            [action.payload.soundId]: true,
          },
        },
      };
    case ACTIONS.FILTER_SOUNDS: {
      return {
        ...state,
        soundsFilter: action.payload.query,
      };
    }
    default:
      return state;
  }
}
