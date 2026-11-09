import { AppDispatch } from "@/store";
import { createOpenCommandAction } from "@/store/actions";
import { getIsCommandOpen } from "@/store/selectors";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useCommand() {
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector(getIsCommandOpen);

  const setOpen = useCallback(
    (value: boolean) => dispatch(createOpenCommandAction(value)),
    [dispatch],
  );

  return {
    open,
    setOpen,
  };
}
