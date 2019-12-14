import User from "../types/User";
import { useSelector } from "react-redux";
import { getUser } from "../store/selectors";

export default function useUser(): User | null {
  return useSelector(getUser);
}
