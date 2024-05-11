import { ReactElement } from "react";
import "./index.css";
import SoundNavItem from "../../components/SoundNavItem";
import Tag from "../../types/Tag";
import useTags from "../../hooks/useTags";
import { Nav } from "reactstrap";

export default function SoundsNav(): ReactElement {
  const { currentTag, tags, changeTag } = useTags();

  return (
    <Nav pills className="sounds-nav">
      {tags.map((tag: Tag) => (
        <SoundNavItem
          key={tag.slug}
          onClick={() => changeTag(tag.slug)}
          isActive={!!currentTag && currentTag.slug === tag.slug}
        >
          {tag.name}
        </SoundNavItem>
      ))}
    </Nav>
  );
}
