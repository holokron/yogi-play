import * as React from "react";
import * as renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import SoundsNav from ".";
import configureStore from "../../store";
import { Provider } from "react-redux";

const store = configureStore();

describe("@components/SoundsNav", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <SoundsNav />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
