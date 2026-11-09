import { useAppStore } from "@/store";
import { getChosenSounds } from "@/store/selectors";
import { type Sound } from "@/types";

export default function useChosenSounds(): Sound[] {
  return useAppStore(getChosenSounds);
}
