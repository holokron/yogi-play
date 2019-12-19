import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  createFilterSoundsAction,
  createChooseTagAction
} from "../store/actions";
import { getChosenTag } from "../store/selectors";

interface SoundSearchHook {
  onChange: { (query: string | null): void };
}

export default function useSoundSearch(): SoundSearchHook {
  const dispatch = useDispatch<AppDispatch>();
  const chosenTag = useSelector(getChosenTag);

  const onChange = (query: string | null): void => {
    if (query && chosenTag && chosenTag.slug !== "all") {
      dispatch(createChooseTagAction("all"));
    }

    dispatch(createFilterSoundsAction(query));
  };

  return {
    onChange
  };
}
