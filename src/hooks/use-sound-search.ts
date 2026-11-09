import { useAppStore } from "@/store";
import { getChosenTag } from "@/store/selectors";

interface SoundSearchHook {
  onChange: { (query: string | null): void };
}

export default function useSoundSearch(): SoundSearchHook {
  const chosenTag = useAppStore(getChosenTag);
  const chooseTag = useAppStore((state) => state.chooseTag);
  const filterSounds = useAppStore((state) => state.filterSounds);

  const onChange = (query: string | null): void => {
    if (query && chosenTag && chosenTag.slug !== "all") {
      chooseTag("all");
    }

    filterSounds(query);
  };

  return {
    onChange,
  };
}
