import * as React from "react";
import * as renderer from "react-test-renderer";
import { mount } from "enzyme";
import PlayButton from ".";
import Sound from "../../types/Sound";

describe("@components/PlayButton", () => {
  it("should match snapshot", () => {
    const sound: Sound = {
      id: "test",
      name: "Test",
      path: "/foo/bar.mp3"
    };

    const tree = renderer.create(<PlayButton sound={sound} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should match snpashot when audio is playing", () => {
    const sound: Sound = {
      id: "test",
      name: "Test",
      path: "/foo/bar.mp3"
    };

    const tree = renderer
      .create(<PlayButton sound={sound} isPlaying />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should have correct props", () => {
    const sound: Sound = {
      id: "test",
      name: "Test",
      path: "/foo/bar.mp3"
    };

    const isPlaying = false;

    const result = mount(<PlayButton sound={sound} isPlaying={isPlaying} />);

    expect(result.props().sound).toEqual(sound);
    expect(result.props().isPlaying).toEqual(isPlaying);
    expect(result.props().onClick).toBeUndefined();
  });

  it("should execute onClick", () => {
    const sound: Sound = {
      id: "test",
      name: "Test",
      path: "/foo/bar.mp3"
    };

    let changeAfterClick = false;

    const onClick = (): void => {
      changeAfterClick = true;
    };

    const result = mount(<PlayButton sound={sound} onClick={onClick} />);

    result.find("button.play-btn__play").simulate("click");

    expect(changeAfterClick).toEqual(true);
  });
});
