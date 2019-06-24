import { ReactElement } from "react";
import Tag from "../types/Tag";
import { getTagsByOrder } from "../store/selectors";
import { useSelector } from "react-redux";

interface Props {
  children: (tags: Tag[]) => React.ReactElement<any>;
}

export default function TagsContainer({
  children
}: Props): ReactElement<Props> {
  const tags = useSelector(getTagsByOrder);

  return children(tags);
}
