import * as React from "react";
import { connect } from "react-redux";
import Sound from "../types/Sound";
import PlayButton from "../components/PlayButton";
import {
  AppDispatch,
  playSound,
  stopSound,
  addUserSound,
  removeUserSound
} from "../store/actions";
import AppState from "../store/state";
import { hasUserSound, getSoundState } from "../store/selectors";
import SoundState from "../types/SoundState";

interface OwnProps {
  sound: Sound;
}

interface StateProps {
  isInUserSounds: boolean;
  soundState: SoundState;
}

interface DispatchProps {
  playSound: { (soundId: string): void };
  stopSound: { (soundId: string): void };
  addUserSound: { (soundId: string): void };
  removeUserSound: { (soundId: string): void };
}

type Props = OwnProps & StateProps & DispatchProps;

class PlayButtonContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onClickFavourites = this.onClickFavourites.bind(this);
  }

  public shouldComponentUpdate(nextProps: Props): boolean {
    return (
      nextProps.soundState.soundId !== this.props.soundState.soundId ||
      nextProps.soundState.isLoading !== this.props.soundState.isLoading ||
      nextProps.soundState.isPlaying !== this.props.soundState.isPlaying
    );
  }

  public render() {
    const {
      onClick,
      onClickFavourites,
      props: { sound, isInUserSounds, soundState }
    } = this;

    return (
      <PlayButton
        sound={sound}
        onClick={onClick}
        isLoading={soundState.isLoading}
        isPlaying={soundState.isPlaying}
        onFavClick={onClickFavourites}
        isFavourite={isInUserSounds}
      />
    );
  }

  public onClick() {
    const { sound, soundState } = this.props;

    if (soundState.isLoading) {
      return;
    }

    if (soundState.isPlaying) {
      this.props.stopSound(sound.id);

      return;
    }

    this.props.playSound(sound.id);
  }

  public onClickFavourites() {
    if (this.props.isInUserSounds) {
      this.props.removeUserSound(this.props.sound.id);
    } else {
      this.props.addUserSound(this.props.sound.id);
    }
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  return {
    soundState: getSoundState(state, ownProps.sound.id),
    isInUserSounds: hasUserSound(state, ownProps.sound.id)
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  playSound: (soundId: string): void => {
    dispatch(playSound(soundId));
  },
  stopSound: (soundId: string): void => {
    dispatch(stopSound(soundId));
  },
  addUserSound: (soundId: string): void => {
    dispatch(addUserSound(soundId));
  },
  removeUserSound: (soundId: string): void => {
    dispatch(removeUserSound(soundId));
  }
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(PlayButtonContainer);
