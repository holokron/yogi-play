import { ReactElement } from "react";
import PlayButton from "@/components/PlayButton";
import { type Sound } from "@/types";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import useCommand from "@/hooks/use-command";

export interface Props {
  sounds: Sound[];
}

export default function SoundsRow({ sounds }: Props): ReactElement {
  const { open, setOpen } = useCommand();

  const toggleSearch = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
        {sounds.map((sound: Sound) => (
          <PlayButton key={sound.id} soundId={sound.id} />
        ))}
      </div>
      <Button
        className="absolute bottom-20 right-4 size-16 rounded-full"
        size="icon"
        onClick={toggleSearch}
      >
        <Search size={24} />
      </Button>
    </>
  );
}
