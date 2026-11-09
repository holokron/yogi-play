import { useEffect } from "react";
import { useAppStore } from "@/store";

export default function useInitialize() {
  useEffect(() => {
    const { loadTags, loadSounds, authenticate } = useAppStore.getState();

    loadTags();
    loadSounds();
    authenticate();
  }, []);
}
