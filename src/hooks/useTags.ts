import { useSelector, useDispatch } from "react-redux";
import { getTagsByOrder, getChosenTag } from "../store/selectors";
import Tag from "../types/Tag";
import { AppDispatch, chooseTag } from "../store/actions";

interface TagsHook {
  currentTag: Tag | null;
  tags: Tag[];
  changeTag(tagSlug: string): void;
}

export default function useTags(): TagsHook {
  const currentTag = useSelector(getChosenTag);
  const tags = useSelector(getTagsByOrder);

  const dispatch = useDispatch<AppDispatch>();

  const changeTag = (tagSlug: string): void => {
    dispatch(chooseTag(tagSlug));
  };

  return {
    currentTag,
    tags,
    changeTag
  };
}
