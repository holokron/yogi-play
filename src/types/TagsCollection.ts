import Tag from "./Tag";

export default interface TagsCollection {
  [tagId: string]: Tag;
}
