import { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import Container from "@/components/Container";
import DefaultTemplate from "@/templates/DefaultTemplate";
import { loadSounds, authenticate } from "@/store/actions";
import SoundsRow from "@/components/SoundsRow";
import SoundsNavHeader from "@/components/SoundsNavHeader";
import useUserSounds from "@/hooks/useUserSounds";
import { AppThunkDispatch } from "@/store";

export default function Favourites(): ReactElement {
  const dispatch = useDispatch<AppThunkDispatch>();

  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadSounds());
  }, [dispatch]);

  const sounds = useUserSounds();

  return (
    <DefaultTemplate>
      <Container>
        <SoundsNavHeader>Ulubione</SoundsNavHeader>
        <SoundsRow sounds={sounds} />
      </Container>
    </DefaultTemplate>
  );
}
