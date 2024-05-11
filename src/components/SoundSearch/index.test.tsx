import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SoundSearch from ".";
import { Provider } from "react-redux";
import configureStore from "../../store";

const store = configureStore();

describe("@components/SoundSearch", () => {
  it("renders correctly", () => {
    const tree = render(
        <Provider store={store}>
          <SoundSearch />
        </Provider>
      );

    expect(tree).toMatchSnapshot();
  });
});
