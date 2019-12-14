import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Container from "../../components/Container";
import Row from "../../components/Row";
import DefaultTemplate from "../../templates/DefaultTemplate";
import {
  AppDispatch,
  loadTags,
  loadSounds,
  authenticate
} from "../../store/actions";
import SoundsNav from "../../components/SoundsNav";
import SoundsRow from "../../components/SoundsRow";
import useChosenSounds from "../../hooks/useChosenSounds";

export interface Props {
  loadTags: () => {};
  loadSounds: () => {};
  authenticate: () => {};
}

export default function Sounds(): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadTags());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadSounds());
  }, [dispatch]);

  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);

  const sounds = useChosenSounds();

  return (
    <DefaultTemplate>
      <Container fluid>
        <Row>
          <SoundsNav />
        </Row>
        <SoundsRow sounds={sounds} />
      </Container>
    </DefaultTemplate>
  );
}
