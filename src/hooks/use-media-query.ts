import { useCallback, useSyncExternalStore } from "react";

export default function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }

      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = () =>
    typeof window !== "undefined" && !!window.matchMedia
      ? window.matchMedia(query).matches
      : false;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
