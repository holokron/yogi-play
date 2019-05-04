import * as actions from "./actions";

describe("store/actions", () => {
  it("@app/PLAY_SOUND", () => {
    const result = actions.createPlaySoundAction("123");

    expect(result).toMatchSnapshot();
  });

  it("@app/STOP_SOUND", () => {
    const result = actions.createStopSoundAction("123");

    expect(result).toMatchSnapshot();
  });

  it("@app/LOAD_SOUND", () => {
    const result = actions.createLoadSoundAction("123");

    expect(result).toMatchSnapshot();
  });

  it("@app/LOAD_SOUNDS", () => {
    const result = actions.createLoadSoundsAction({
      "123": {
        id: "123",
        name: "Foo",
        path: "/foo/bar.mp3"
      }
    });

    expect(result).toMatchSnapshot();
  });

  it("@app/FILTER_SOUNDS", () => {
    const result = actions.createFilterSoundsAction("foo");

    expect(result).toMatchSnapshot();
  });
});
