import { describe, it, expect } from "vitest";
import * as actions from "./actions";

describe("store/actions", () => {
  it("@app/LOAD_SOUNDS", () => {
    const result = actions.createLoadSoundsAction({
      "123": {
        id: "123",
        name: "Foo",
        path: "/foo/bar.mp3",
      },
    });

    expect(result).toMatchSnapshot();
  });

  it("@app/FILTER_SOUNDS", () => {
    const result = actions.createFilterSoundsAction("foo");

    expect(result).toMatchSnapshot();
  });
});
