import { useAppStore } from "@/store";
import { getIsNavMenuOpen } from "@/store/selectors";

export default function useNavMenu() {
  const open = useAppStore(getIsNavMenuOpen);
  const setOpen = useAppStore((state) => state.setNavMenuOpen);

  return {
    open,
    setOpen,
  };
}
