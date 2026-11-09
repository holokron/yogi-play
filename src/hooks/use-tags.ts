import { useAppStore } from "@/store";
import { getTagsByOrder, getChosenTag } from "@/store/selectors";
import { type Tag } from "@/types";

interface TagsHook {
  currentTag: Tag | null;
  tags: Tag[];
  changeTag(tagSlug: string): void;
}

export default function useTags(): TagsHook {
  const currentTag = useAppStore(getChosenTag);
  const tags = useAppStore(getTagsByOrder);
  const changeTag = useAppStore((state) => state.chooseTag);

  return {
    currentTag,
    tags,
    changeTag,
  };
}
