import * as React from "react";
import * as renderer from "react-test-renderer";
import SoundSearch, { SoundSearchProps } from ".";

describe("@components/SoundSearch", () => {
  it.each([
    [
      {
        onChange: (): void => {},
        query: null
      }
    ],
    [
      {
        onChange: (): void => {},
        query: "foo"
      }
    ]
  ] as SoundSearchProps[][])(
    "renders correctly with props: %p",
    (props: SoundSearchProps) => {
      const tree = renderer.create(<SoundSearch {...props} />).toJSON();

      expect(tree).toMatchSnapshot();
    }
  );
});
