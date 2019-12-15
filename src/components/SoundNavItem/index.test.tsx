import * as React from "react";
import * as renderer from "react-test-renderer";
import SoundNavItem from ".";

describe("@components/SoundNavItem", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SoundNavItem>Test</SoundNavItem>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders correctly, props (isActive = true)", () => {
    const tree = renderer
      .create(<SoundNavItem isActive>Test</SoundNavItem>)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
