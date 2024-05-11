import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainMenu from ".";

describe("@components/MainMenu", () => {
  it("renders correctly", () => {
    const tree = render(
      <MemoryRouter>
        <MainMenu />
      </MemoryRouter>
    );
    
    expect(tree).toMatchSnapshot();
  });
});
