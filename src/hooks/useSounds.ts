import { useSelector } from "react-redux";
import { getSounds } from "@/store/selectors";

export default function useSounds() {
  return useSelector(getSounds);
}
