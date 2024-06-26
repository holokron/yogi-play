import { FC, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import useSoundPlayer from "@/hooks/use-sound-player";
import { CirclePause, CirclePlay, ListMusic } from "lucide-react";
import useTags from "@/hooks/use-tags";
import useSounds from "@/hooks/use-sounds";
import useUserSounds from "@/hooks/use-user-sounds";
import { useSelector } from "react-redux";
import { getUserSoundsIds } from "@/store/selectors";
import { createSearchRegex } from "@/lib/search";
import { useLocation, useNavigate } from "react-router";
import { type Sound, type Tag } from "@/types";
import useCommand from "@/hooks/use-command";

export default function CommandMenu() {
  const { open, setOpen } = useCommand();

  const userSounds = useUserSounds();
  const { tags } = useTags();
  const sounds = useSounds();
  const userSoundsIds = useSelector(getUserSoundsIds);
  const location = useLocation();
  const navigate = useNavigate();
  const isOnFavorites = location.pathname === "/ulubione";

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["k", "f"].includes(e.key) && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = () => {
    if (isOnFavorites) {
      navigate("/");
    }

    setOpen(false);
  };

  const handleFilter = (value: string, search: string) => {
    return createSearchRegex(search).test(value) ? 1 : 0;
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} filter={handleFilter}>
      <CommandInput placeholder="Szukaj dźwięku..." />
      <CommandList>
        <CommandEmpty>Nie znaleziono :(</CommandEmpty>
        <CommandGroup heading="Ulubione">
          {userSounds.map((sound) => (
            <SoundCommandItem key={sound.id} sound={sound} />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Kategorie">
          {tags.map((tag) => (
            <TagCommandItem key={tag.id} tag={tag} onSelect={handleSelect} />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Dźwięki">
          {sounds
            .filter((sound) => !userSoundsIds.includes(sound.id))
            .map((sound) => (
              <SoundCommandItem key={sound.id} sound={sound} />
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

type TagCommandItemProps = {
  tag: Tag;
  onSelect: () => void;
};

const TagCommandItem: FC<TagCommandItemProps> = ({ tag, onSelect }) => {
  const { changeTag } = useTags();

  const handleSelect = () => {
    changeTag(tag.slug);

    onSelect();
  };

  return (
    <CommandItem key={tag.id} value={tag.name} onSelect={handleSelect}>
      <ListMusic className="mr-2 h-4 w-4" /> {tag.name}
    </CommandItem>
  );
};

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
      {isPlaying ? (
        <CirclePause className="mr-2 h-4 w-4" />
      ) : (
        <CirclePlay className="mr-2 h-4 w-4" />
      )}{" "}
      {sound.name}
      <CommandShortcut>↵</CommandShortcut>
    </CommandItem>
  );
};
