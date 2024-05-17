import { FC } from "react";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import SoundsRow from "@/components/SoundsRow";
import { ScrollArea } from "@/components/ui/scroll-area";
import useChosenSounds from "@/hooks/useChosenSounds";
import useTags from "@/hooks/useTags";
import { CommandMenu } from "@/components/CommandMenu";

export default function Sounds() {
  const sounds = useChosenSounds();

  return (
    <>
      <Content header={<SoundsHeader />}>
        <ScrollArea className="h-lvh pr-3">
          <SoundsRow sounds={sounds} />
        </ScrollArea>
      </Content>
      <CommandMenu />
    </>
  );
}

const SoundsHeader: FC = () => {
  const { currentTag } = useTags();

  return <Header>{currentTag?.name}</Header>;
};
