import { useAppStore } from "@/store";
import { getSounds } from "@/store/selectors";

export default function useSounds() {
  return useAppStore(getSounds);
}
