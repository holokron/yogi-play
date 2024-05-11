import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SoundsNav from ".";
import configureStore from "../../store";
import { Provider } from "react-redux";

const store = configureStore();

describe("@components/SoundsNav", () => {
  it("renders correctly", () => {
    const tree = render(
      <Provider store={store}>
        <MemoryRouter>
          <SoundsNav />
        </MemoryRouter>
      </Provider>
    );

    expect(tree).toMatchSnapshot();
  });
});
