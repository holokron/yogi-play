import Sound from "@/types/Sound";
import { useSelector } from "react-redux";
import { getUserSounds } from "@/store/selectors";

export default function useUserSounds(): Sound[] {
  return useSelector(getUserSounds);
}
