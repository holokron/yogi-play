import { FC } from "react";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import SoundsRow from "@/components/SoundsRow";
import useChosenSounds from "@/hooks/use-chosen-sounds";
import useTags from "@/hooks/use-tags";
import { ListMusic } from "lucide-react";

export default function Sounds() {
  const sounds = useChosenSounds();

  return (
    <Content header={<SoundsHeader />}>
      <SoundsRow sounds={sounds} />
    </Content>
  );
}

const SoundsHeader: FC = () => {
  const { currentTag } = useTags();

  return (
    <Header>
      <ListMusic size={28} />
      {currentTag?.name}
    </Header>
  );
};
