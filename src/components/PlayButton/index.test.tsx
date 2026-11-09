import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import PlayButton from ".";
import { useAppStore } from "@/store";
import { initialState } from "@/store/state";

describe("@components/PlayButton", () => {
  beforeEach(() => {
    useAppStore.setState({
      ...initialState,
      sounds: {
        qwertyasdfgh: {
          id: "test",
          name: "Test",
          path: "/foo/bar.mp3",
        },
      },
    });
  });

  it("should match snapshot", () => {
    const tree = render(<PlayButton soundId="qwertyasdfgh" />);

    expect(tree).toMatchSnapshot();
  });
});
