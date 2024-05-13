import Sound from "@/types/Sound";
import PlayButton from "@/components/PlayButton";
import useChosenSounds from "@/hooks/useChosenSounds";

export default function SoundsRow(): JSX.Element {
  const sounds = useChosenSounds();

  return (
    <div className="flex flex-wrap gap-2 justify-center pt-3">
      {sounds.map((sound: Sound) => (
        <PlayButton key={sound.id} soundId={sound.id} />
      ))}
    </div>
  );
}
