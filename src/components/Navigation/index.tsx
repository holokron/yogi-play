import React, { ReactElement } from "react";
import Navbar from "reactstrap/lib/Navbar";
import NavbarToggler from "reactstrap/lib/NavbarToggler";
import Collapse from "reactstrap/lib/Collapse";
import "./index.css";
import MainMenu from "../MainMenu";
import NavBrandLink from "../../components/NavBrandLink";
import useToggle from "../../hooks/useToggle";
import SoundSearch from "../SoundSearch";
import TextToSpeech from "../TextToSpeech";

export default function Navigation(): ReactElement {
  const [toggled, toggle, toggleOf] = useToggle();

  return (
    <Navbar dark expand="md" color="dark" className="navigation">
      <NavBrandLink />
      <NavbarToggler type="button" onClick={toggle} />
      <Collapse isOpen={toggled} navbar>
        <MainMenu onLinkClick={toggleOf} />
        <TextToSpeech />
        <SoundSearch />
      </Collapse>
    </Navbar>
  );
}
