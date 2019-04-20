import * as React from "react";
import AppState from "../store/state";
import { getUserSounds } from "../store/selectors";
import { connect } from "react-redux";
import Sound from "../types/Sound";

interface OwnProps {
  children: { (sounds: Sound[]): React.ReactElement<any> | null };
}

interface StateProps {
  sounds: Sound[];
}

export type Props = OwnProps & StateProps;

function UserSoundsContainer({
  children,
  sounds
}: Props): React.ReactElement<Props> | null {
  return children(sounds);
}

const mapStateToProps = (state: AppState) => ({
  sounds: getUserSounds(state)
});

export default connect<StateProps, {}, OwnProps, AppState>(mapStateToProps)(
  UserSoundsContainer
);
