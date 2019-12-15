import * as React from "react";
import * as renderer from "react-test-renderer";
import { shallow } from "enzyme";
import Footer from ".";

describe("@components/Footer", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Footer />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should render without errors", () => {
    const result = shallow(<Footer />);

    expect(
      result.matchesElement(
        <p className="text-muted text-center mt-4">
          &copy;&nbsp;
          <a className="text-muted" href="https://github.com/holokron">
            Holokron
          </a>
        </p>
      )
    ).toBeTruthy();
  });
});
