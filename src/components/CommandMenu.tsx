import { FC, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSelector } from "react-redux";
import { getSoundsFilter, getUserSounds } from "@/store/selectors";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import Sound from "@/types/Sound";
import { Pause, Play } from "lucide-react";
import useSoundSearch from "@/hooks/useSoundSearch";
import useChosenSounds from "@/hooks/useChosenSounds";

export function CommandMenu() {
  const [open, setOpen] = useState(false);

  const userSounds = useSelector(getUserSounds);

  const { onChange } = useSoundSearch();
  const soundsFilter = useSelector(getSoundsFilter);

  const chosenSounds = useChosenSounds();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      return;
    }

    onChange("");
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Szukaj dźwięku..."
        onValueChange={onChange}
        value={soundsFilter ?? ""}
      />
      <CommandList>
        <CommandGroup heading="Favourites">
          {userSounds.map((sound) => (
            <SoundCommandItem key={sound.id} sound={sound} />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Results">
          {chosenSounds.map((sound) => (
            <SoundCommandItem key={sound.id} sound={sound} />
          ))}
        </CommandGroup>
        <CommandEmpty>Nie znaleziono :(</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}

type SoundCommandItemProps = {
  sound: Sound;
};

const SoundCommandItem: FC<SoundCommandItemProps> = ({ sound }) => {
  const { playSound, stopSound, isPlaying } = useSoundPlayer(sound.id);

  const handleSelect = () => {
    if (isPlaying) {
      stopSound();
      return;
    }

    playSound();
  };

  return (
    <CommandItem key={sound.id} value={sound.name} onSelect={handleSelect}>
      {isPlaying ? <Pause size={12} /> : <Play size={8} />} {sound.name}
    </CommandItem>
  );
};
