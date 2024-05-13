import Sound from "@/types/Sound";
import PlayButton from "@/components/PlayButton";

export interface Props {
  sounds: Sound[];
}

export default function SoundsRow({ sounds }: Props): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2 justify-center pt-3">
      {sounds.map((sound: Sound) => (
        <PlayButton key={sound.id} soundId={sound.id} />
      ))}
    </div>
  );
}
