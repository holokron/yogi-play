import React, { ReactElement } from "react";
import Navbar from "reactstrap/lib/Navbar";
import NavbarToggler from "reactstrap/lib/NavbarToggler";
import Collapse from "reactstrap/lib/Collapse";
import "./index.css";
import MainMenu from "../MainMenu";
import NavBrandLink from "../../components/NavBrandLink";
import useToggle from "../../hooks/useToggle";
import SoundSearchContainer from "../../containers/SoundSearchContainer";
import TextToSpeechContainer from "../../containers/TextToSpeechContainer";

export default function Navigation(): ReactElement {
  const [toggled, toggle, toggleOf] = useToggle();

  return (
    <Navbar dark expand="md" color="dark" className="navigation">
      <NavBrandLink />
      <NavbarToggler type="button" onClick={toggle} />
      <Collapse isOpen={toggled} navbar>
        <MainMenu onLinkClick={toggleOf} />
        <TextToSpeechContainer />
        <SoundSearchContainer />
      </Collapse>
    </Navbar>
  );
}
