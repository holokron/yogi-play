import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import Container from "../../components/Container";
import DefaultTemplate from "../../templates/DefaultTemplate";
import { AppDispatch, loadSounds, authenticate } from "../../store/actions";
import SoundsRow from "../../components/SoundsRow";
import SoundsNavHeader from "../../components/SoundsNavHeader";
import Row from "../../components/Row";
import useUserSounds from "../../hooks/useUserSounds";

export default function Favourites(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadSounds());
  }, [dispatch]);

  const sounds = useUserSounds();

  return (
    <DefaultTemplate>
      <Container fluid>
        <Row>
          <SoundsNavHeader>Ulubione</SoundsNavHeader>
        </Row>
        <SoundsRow sounds={sounds} />
      </Container>
    </DefaultTemplate>
  );
}
