import { type Sound } from "@/types";
import { useAppStore } from "@/store";
import { getUserSounds } from "@/store/selectors";

export default function useUserSounds(): Sound[] {
  return useAppStore(getUserSounds);
}
