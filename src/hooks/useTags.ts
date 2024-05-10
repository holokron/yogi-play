import { useSelector, useDispatch } from "react-redux";
import { getTagsByOrder, getChosenTag } from "../store/selectors";
import Tag from "../types/Tag";
import { chooseTag } from "../store/actions";
import { AppThunkDispatch } from "../store";

interface TagsHook {
  currentTag: Tag | null;
  tags: Tag[];
  changeTag(tagSlug: string): void;
}

export default function useTags(): TagsHook {
  const currentTag = useSelector(getChosenTag);
  const tags = useSelector(getTagsByOrder);

  const dispatch = useDispatch<AppThunkDispatch>();

  const changeTag = (tagSlug: string): void => {
    dispatch(chooseTag(tagSlug));
  };

  return {
    currentTag,
    tags,
    changeTag,
  };
}
