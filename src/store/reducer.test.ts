import { describe, it, expect } from "vitest";
import AppState, { initialState } from "./state";
import appReducer from "./reducer";
import { AppAction, ACTIONS } from "./actions";

export {};

describe("store/reducer", () => {
  it.each<[AppAction, AppState]>([
    [
      {
        type: ACTIONS.FILTER_SOUNDS,
        payload: {
          query: "foo",
        },
      },
      { ...initialState },
    ],
    [
      {
        type: ACTIONS.FILTER_SOUNDS,
        payload: {
          query: null,
        },
      },
      { ...initialState },
    ],
  ])("action = %o", (action, state) => {
    const result = appReducer(state, action);

    expect(result).toMatchSnapshot();
  });
});
