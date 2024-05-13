import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSoundPlayer from "@/hooks/useSoundPlayer";
import useUserSoundManager from "@/hooks/useUserSoundManager";
import { getSound } from "@/store/selectors";
import AppState from "@/store/state";
import { cn } from "@/lib/utils";

export interface Props {
  soundId: string;
}

function PlayButton({ soundId }: Props): ReactElement<Props> | null {
  const { playSound, stopSound, loadSound, isPlaying } =
    useSoundPlayer(soundId);

  const { addUserSound, removeUserSound, isInUserSounds } =
    useUserSoundManager(soundId);

  const handleClickPlay = (): void => {
    if (isPlaying) {
      stopSound();

      return;
    }

    playSound();
  };

  const handleClickFavourites = (): void => {
    if (isInUserSounds) {
      removeUserSound();
    } else {
      addUserSound();
    }
  };

  const onMouseEnter = () => {
    loadSound();
  };

  const sound = useSelector((state: AppState) => getSound(state, soundId));

  if (!sound) {
    return null;
  }

  return (
    <div
      className={cn("flex rounded-full gap-0 drop-shadow-md text-blue-500", {
        ["animated infinite pulse"]: isPlaying,
      })}
      onMouseEnter={onMouseEnter}
    >
      <Button
        className="w-40 md:w-48 truncate uppercase rounded-l-2xl rounded-r-none"
        variant="outline"
        name={sound.name}
        onClick={handleClickPlay}
      >
        {sound.name}
      </Button>

      <Button
        className="w-10 rounded-r-2xl rounded-l-none"
        size="icon"
        variant={isInUserSounds ? "default" : "outline"}
        onClick={handleClickFavourites}
      >
        <Star size={20} />
      </Button>
    </div>
  );
}

export default PlayButton;
