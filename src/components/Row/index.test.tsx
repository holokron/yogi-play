import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Row from ".";

describe("@components/Row", () => {
  it("renders correctly", () => {
    const tree = render(<Row>Test</Row>);

    expect(tree).toMatchSnapshot();
  });

  it("should render without errors, props (withTopPadding = true)", () => {
    const tree = render(<Row withTopPadding>Test</Row>);

    expect(tree).toMatchSnapshot();
  });
});
