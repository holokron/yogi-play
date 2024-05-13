import { ReactElement } from "react";
import "./index.css";
import Tag from "@/types/Tag";
import useTags from "@/hooks/useTags";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SoundsNav(): ReactElement {
  const { currentTag, tags, changeTag } = useTags();

  console.log("currentTag", currentTag)

  return (
    <div className="flex justify-center">
      <Tabs value={currentTag?.slug}>
        <TabsList>
          {tags.map((tag: Tag) => (
            <TabsTrigger
              className="uppercase"
              key={tag.slug}
              value={tag.slug}
              onClick={() => changeTag(tag.slug)}
            >
              {tag.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
