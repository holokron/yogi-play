import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Container from "@/components/Container";
import Row from "@/components/Row";
import DefaultTemplate from "@/templates/DefaultTemplate";
import { loadTags, loadSounds, authenticate } from "@/store/actions";
import SoundsNav from "@/components/SoundsNav";
import SoundsRow from "@/components/SoundsRow";
import { AppThunkDispatch } from "@/store";

export interface Props {
  loadTags: () => {};
  loadSounds: () => {};
  authenticate: () => {};
}

export default function Sounds(): JSX.Element {
  const dispatch = useDispatch<AppThunkDispatch>();

  useEffect(() => {
    dispatch(loadTags());
    dispatch(loadSounds());
    dispatch(authenticate());
  }, [dispatch]);

  return (
    <DefaultTemplate>
      <Container>
        <SoundsNav />
        <SoundsRow />
      </Container>
    </DefaultTemplate>
  );
}
