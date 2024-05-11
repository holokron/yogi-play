import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SoundNavItem from ".";

describe("@components/SoundNavItem", () => {
  it("renders correctly", () => {
    const tree = render(<SoundNavItem>Test</SoundNavItem>);

    expect(tree).toMatchSnapshot();
  });

  it("renders correctly, props (isActive = true)", () => {
    const tree = render(<SoundNavItem isActive>Test</SoundNavItem>);

    expect(tree).toMatchSnapshot();
  });
});
