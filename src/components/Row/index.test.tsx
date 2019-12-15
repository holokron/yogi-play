import * as React from "react";
import * as renderer from "react-test-renderer";
import Row from ".";

describe("@components/Row", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Row>Test</Row>).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should render without errors, props (withTopPadding = true)", () => {
    const tree = renderer.create(<Row withTopPadding>Test</Row>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
