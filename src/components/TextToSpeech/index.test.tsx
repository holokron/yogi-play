import { describe, it } from "vitest";
import { ComponentProps } from "react";
import TextToSpeech from ".";

type TextToSpeechProps = ComponentProps<typeof TextToSpeech>;

describe("@components/TextToSpeech", () => {
  it.each([
    [
      {
        readText: (): void => {},
      },
    ],
  ] as TextToSpeechProps[][])(
    "renders correctly with props: %p",
    (props: TextToSpeechProps) => {}
  );
});
