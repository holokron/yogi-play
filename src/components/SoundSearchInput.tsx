import { ChangeEventHandler, FC } from "react";
import { Input } from "@/components/ui/input";
import useSoundSearch from "@/hooks/useSoundSearch";
import { useSelector } from "react-redux";
import { getSoundsFilter } from "@/store/selectors";

export const SoundSearchInput: FC = () => {
  const { onChange } = useSoundSearch();
  const soundsFilter = useSelector(getSoundsFilter);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <Input
      type="search"
      placeholder="Szukaj dźwięku"
      className="w-40 md:w-64"
      value={soundsFilter ?? ""}
      onChange={handleChange}
    />
  );
};
