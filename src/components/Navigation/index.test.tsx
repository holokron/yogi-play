import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navigation from ".";
import configureStore from "../../store";
import { Provider } from "react-redux";

const store = configureStore();

describe("@components/Navigation", () => {
  it("renders correctly", () => {
    const tree = render(
      <Provider store={store}>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    expect(tree).toMatchSnapshot();
  });
});
