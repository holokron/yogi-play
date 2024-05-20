import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { createOpenNavMenuAction } from "@/store/actions";
import { getIsNavMenuOpen } from "@/store/selectors";

export default function useNavMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector(getIsNavMenuOpen);

  const setOpen = (value: boolean) => dispatch(createOpenNavMenuAction(value));

  return {
    open,
    setOpen,
  };
}
