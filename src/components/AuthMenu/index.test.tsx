import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import AuthMenu from ".";
import configureStore from "../../store";
import { initialState } from "../../store/state";

const store = configureStore({
  ...initialState,
  user: {
    id: "foo",
    displayName: "Foo Bar",
    email: "foo@bar.com",
  },
});

describe("@components/AuthMenu", () => {
  it("renders correctly", () => {
    const tree = render(
      <Provider store={store}>
        <MemoryRouter>
          <AuthMenu />
        </MemoryRouter>
      </Provider>
    );

    expect(tree).toMatchSnapshot();
  });
});
