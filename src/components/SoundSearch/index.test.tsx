import * as React from "react";
import * as renderer from "react-test-renderer";
import SoundSearch from ".";
import { Provider } from "react-redux";
import configureStore from "../../store";

const store = configureStore();

describe("@components/SoundSearch", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <SoundSearch />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
