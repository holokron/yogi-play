import { AppDispatch } from "@/store";
import { createOpenCommandAction } from "@/store/actions";
import { getIsCommandOpen } from "@/store/selectors";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function useCommand() {
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector(getIsCommandOpen);

  const setOpen = (value: boolean) => dispatch(createOpenCommandAction(value));

  return {
    open,
    setOpen,
  };
}
