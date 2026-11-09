import { ChangeEventHandler, FC } from "react";
import { Input } from "@/components/ui/input";
import useSoundSearch from "@/hooks/use-sound-search";
import useMediaQuery from "@/hooks/use-media-query";
import { useAppStore } from "@/store";
import { getSoundsFilter } from "@/store/selectors";
import { Search } from "lucide-react";

export const SoundSearchInput: FC = () => {
  const { onChange } = useSoundSearch();
  const soundsFilter = useAppStore(getSoundsFilter);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex flex-1 min-w-0 max-w-72 gap-2 items-center">
      <Search size={24} className="shrink-0" />
      <Input
        size={12}
        type="search"
        placeholder={isDesktop ? "Szukaj dźwięku... ⌘ + K" : "Szukaj..."}
        className="w-full h-8 text-foreground"
        value={soundsFilter ?? ""}
        onChange={handleChange}
      />
    </div>
  );
};
