import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBrandLink from ".";

describe("@components/NavBrandLink", () => {
  it("renders correctly", () => {
    const tree = render(
      <MemoryRouter>
        <NavBrandLink />
      </MemoryRouter>
    );

    expect(tree).toMatchSnapshot();
  });
});
