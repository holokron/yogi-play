import { useSelector } from "react-redux";
import { getChosenSounds } from "@/store/selectors";
import { type Sound } from "@/types";

export default function useChosenSounds(): Sound[] {
  return useSelector(getChosenSounds);
}
