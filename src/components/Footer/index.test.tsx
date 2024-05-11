import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Footer from ".";

describe("@components/Footer", () => {
  it("renders correctly", () => {
    const tree = render(<Footer />);

    expect(tree).toMatchSnapshot();
  });
});
