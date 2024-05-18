import Sound from "@/types/Sound";
import PlayButton from "@/components/PlayButton";
import { ScrollArea } from "../ui/scroll-area";

export interface Props {
  sounds: Sound[];
}

export default function SoundsRow({ sounds }: Props): JSX.Element {
  return (
    <ScrollArea className="w-full h-lvh pb-40">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
        {sounds.map((sound: Sound) => (
          <PlayButton key={sound.id} soundId={sound.id} />
        ))}
      </div>
    </ScrollArea>
  );
}
