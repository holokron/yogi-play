import * as React from "react";
import * as renderer from "react-test-renderer";
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
      path: "/foo/bar.mp3"
    }
  }
};

const store = configureStore(state);

describe("@components/PlayButton", () => {
  it("should match snapshot", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <PlayButton soundId="qwertyasdfgh" />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
