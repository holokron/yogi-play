import { FC } from "react";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import SoundsRow from "@/components/SoundsRow";
import useChosenSounds from "@/hooks/useChosenSounds";
import useTags from "@/hooks/useTags";
import { CommandMenu } from "@/components/CommandMenu";

export default function Sounds() {
  const sounds = useChosenSounds();

  return (
    <>
      <Content header={<SoundsHeader />}>
        <SoundsRow sounds={sounds} />
      </Content>
      <CommandMenu />
    </>
  );
}

const SoundsHeader: FC = () => {
  const { currentTag } = useTags();

  return <Header>{currentTag?.name}</Header>;
};
