import AppState, { initialState } from "./state";
import appReducer from "./reducer";
import { AppAction, ACTIONS } from "./actions";

describe("store/reducer", () => {
  it.each<[AppAction, AppState]>([
    [
      {
        type: ACTIONS.PLAY_SOUND,
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
        sounds: {
          "123": {
            id: "123",
            name: "Foo",
            path: "/foo.mp3",
            isLoading: false,
            isPlaying: true
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
      }
    ],
    [
      {
        type: ACTIONS.FILTER_SOUNDS,
        payload: {
          query: "foo"
        }
      },
      { ...initialState }
    ],
    [
      {
        type: ACTIONS.FILTER_SOUNDS,
        payload: {
          query: null
        }
      },
      { ...initialState }
    ]
  ])("action = %o", (action: AppAction, state: AppState) => {
    const result = appReducer(state, action);

    expect(result).toMatchSnapshot();
  });
});
