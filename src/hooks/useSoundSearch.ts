import { useDispatch, useSelector } from "react-redux";
import {
  createFilterSoundsAction,
  createChooseTagAction,
} from "@/store/actions";
import { getChosenTag } from "@/store/selectors";
import { AppThunkDispatch } from "@/store";

interface SoundSearchHook {
  onChange: { (query: string | null): void };
}

export default function useSoundSearch(): SoundSearchHook {
  const dispatch = useDispatch<AppThunkDispatch>();
  const chosenTag = useSelector(getChosenTag);

  const onChange = (query: string | null): void => {
    if (query && chosenTag && chosenTag.slug !== "all") {
      dispatch(createChooseTagAction("all"));
    }

    dispatch(createFilterSoundsAction(query));
  };

  return {
    onChange,
  };
}
