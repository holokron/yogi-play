import * as React from "react";
import { getUserSounds } from "../store/selectors";
import { useSelector } from "react-redux";
import Sound from "../types/Sound";

interface Props {
  children: { (sounds: Sound[]): React.ReactElement<any> | null };
}

export default function UserSoundsContainer({
  children
}: Props): React.ReactElement<Props> | null {
  const sounds = useSelector(getUserSounds);

  return children(sounds);
}
