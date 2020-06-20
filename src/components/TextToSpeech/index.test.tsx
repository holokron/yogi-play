import * as React from "react";
import * as renderer from "react-test-renderer";
import TextToSpeech, { TextToSpeechProps } from ".";

describe("@components/TextToSpeech", () => {
  it.each([
    [
      {
        readText: (): void => {},
      },
    ],
  ] as TextToSpeechProps[][])(
    "renders correctly with props: %p",
    (props: TextToSpeechProps) => {
      const tree = renderer.create(<TextToSpeech {...props} />).toJSON();

      expect(tree).toMatchSnapshot();
    }
  );
});
