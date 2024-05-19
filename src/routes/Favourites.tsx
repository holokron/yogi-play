import { FC } from "react";
import { Content } from "@/components/Content";
import { Header } from "@/components/Header";
import SoundsRow from "@/components/SoundsRow";
import useUserSounds from "@/hooks/useUserSounds";
import { Heart } from "lucide-react";

export default function Favourites() {
  const sounds = useUserSounds();

  return (
    <Content header={<FavouritesHeader />}>
      <SoundsRow sounds={sounds} />
    </Content>
  );
}

const FavouritesHeader: FC = () => {
  return (
    <Header>
      <Heart size={28} />
      Ulubione
    </Header>
  );
};
