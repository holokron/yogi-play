import * as React from "react";
import * as renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import Navigation from ".";
import configureStore from "../../store";
import { Provider } from "react-redux";

const store = configureStore();

describe("@components/Navigation", () => {
  it("renders correctly", () => {
    const tree = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
