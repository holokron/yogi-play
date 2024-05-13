import Sound from "@/types/Sound";
import { useSelector } from "react-redux";
import { getChosenSounds } from "@/store/selectors";

export default function useChosenSounds(): Sound[] {
  return useSelector(getChosenSounds);
}
