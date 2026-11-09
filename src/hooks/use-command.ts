import { useAppStore } from "@/store";
import { getIsCommandOpen } from "@/store/selectors";

export default function useCommand() {
  const open = useAppStore(getIsCommandOpen);
  const setOpen = useAppStore((state) => state.setCommandOpen);

  return {
    open,
    setOpen,
  };
}
