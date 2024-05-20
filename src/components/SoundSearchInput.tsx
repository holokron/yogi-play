import { ChangeEventHandler, FC } from "react";
import { Input } from "@/components/ui/input";
import useSoundSearch from "@/hooks/use-sound-search";
import { useSelector } from "react-redux";
import { getSoundsFilter } from "@/store/selectors";
import { Search } from "lucide-react";

export const SoundSearchInput: FC = () => {
  const { onChange } = useSoundSearch();
  const soundsFilter = useSelector(getSoundsFilter);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex gap-2 items-center">
      <Search size={24}/>
      <Input
        size={12}
        type="search"
        placeholder="Szukaj dźwięku... ⌘ + K"
        className="w-40 md:w-64 h-8 text-foreground"
        value={soundsFilter ?? ""}
        onChange={handleChange}
      />
    </div>
  );
};
