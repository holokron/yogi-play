import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import PlayButton from ".";
import { Provider } from "react-redux";
import configureStore from "../../store";
import { initialState } from "../../store/state";

const state = {
  ...initialState,
  sounds: {
    qwertyasdfgh: {
      id: "test",
      name: "Test",
      path: "/foo/bar.mp3",
    },
  },
};

const store = configureStore(state);

describe("@components/PlayButton", () => {
  it("should match snapshot", () => {
    const tree = render(
      <Provider store={store}>
        <PlayButton soundId="qwertyasdfgh" />
      </Provider>
    );

    expect(tree).toMatchSnapshot();
  });
});
