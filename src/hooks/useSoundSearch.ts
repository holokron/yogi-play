import { useDispatch } from "react-redux";
import { AppDispatch, createFilterSoundsAction } from "../store/actions";

interface SoundSearchHook {
  onChange: { (query: string | null): void };
}

export default function useSoundSearch(): SoundSearchHook {
  const dispatch = useDispatch<AppDispatch>();

  const onChange = (query: string | null): void => {
    dispatch(createFilterSoundsAction(query));
  };

  return {
    onChange
  };
}
