import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Container from "@/components/Container";
import DefaultTemplate from "@/templates/DefaultTemplate";
import { loadTags, loadSounds, authenticate } from "@/store/actions";
import SoundsNav from "@/components/SoundsNav";
import SoundsRow from "@/components/SoundsRow";
import { AppThunkDispatch } from "@/store";
import useChosenSounds from "@/hooks/useChosenSounds";

export interface Props {
  loadTags: () => {};
  loadSounds: () => {};
  authenticate: () => {};
}

export default function Sounds(): JSX.Element {
  const dispatch = useDispatch<AppThunkDispatch>();
  const sounds = useChosenSounds();

  useEffect(() => {
    dispatch(loadTags());
    dispatch(loadSounds());
    dispatch(authenticate());
  }, [dispatch]);

  return (
    <DefaultTemplate>
      <Container>
        <SoundsNav />
        <SoundsRow sounds={sounds} />
      </Container>
    </DefaultTemplate>
  );
}
