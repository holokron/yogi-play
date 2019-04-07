import AppState, { initialState } from "./state";
import appReducer from "./reducer";
import { AppAction, ACTIONS } from "./actions";

describe("store/reducer", () => {
  it.each<[AppAction, AppState, AppState]>([
    [
      {
        type: ACTIONS.PLAY_SOUND,
        payload: {
          soundId: "123"
        }
      },
      {
        ...initialState,
        soundStates: {
          "123": {
            soundId: "123",
            isLoading: false,
            isPlaying: false
          }
        }
      },
      {
        ...initialState,
        soundStates: {
          "123": {
            soundId: "123",
            isLoading: false,
            isPlaying: true
          }
        }
      }
    ],
    [
      {
        type: ACTIONS.STOP_SOUND,
        payload: {
          soundId: "123"
        }
      },
      {
        ...initialState,
        soundStates: {
          "123": {
            soundId: "123",
            isLoading: false,
            isPlaying: true
          }
        }
      },
      {
        ...initialState,
        soundStates: {
          "123": {
            soundId: "123",
            isLoading: false,
            isPlaying: false
          }
        }
      }
    ],
    [
      {
        type: ACTIONS.LOAD_SOUND,
        payload: {
          soundId: "123"
        }
      },
      {
        ...initialState,
        sounds: {
          "123": {
            id: "123",
            name: "Foo",
            path: "/foo.mp3",
            isLoading: false,
            isPlaying: false
          }
        }
      },
      {
        ...initialState,
        sounds: {
          "123": {
            id: "123",
            name: "Foo",
            path: "/foo.mp3",
            isLoading: true,
            isPlaying: false
          }
        }
      }
    ]
  ])(
    "action = %o",
    (action: AppAction, state: AppState, expected: AppState) => {
      const result = appReducer(state, action);

      expect(result).toEqual(expected);
    }
  );
});
