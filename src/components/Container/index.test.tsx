import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Container from ".";

describe("@components/Container", () => {
  it("renders correctly", () => {
    const tree = render(<Container>Test</Container>);

    expect(tree).toMatchSnapshot();
  });
});
