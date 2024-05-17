import { FC } from "react";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import SoundsRow from "@/components/SoundsRow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommandMenu } from "@/components/CommandMenu";
import useUserSounds from "@/hooks/useUserSounds";

export default function Favourites() {
  const sounds = useUserSounds();

  return (
    <>
      <Content header={<FavouritesHeader />}>
        <ScrollArea className="h-lvh pr-3">
          <SoundsRow sounds={sounds} />
        </ScrollArea>
      </Content>
      <CommandMenu />
    </>
  );
}

const FavouritesHeader: FC = () => {
  return <Header>Ulubione</Header>;
};
