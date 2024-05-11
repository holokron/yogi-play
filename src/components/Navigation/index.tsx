import { ReactElement } from "react";
import "./index.css";
import MainMenu from "../MainMenu";
import NavBrandLink from "../../components/NavBrandLink";
import useToggle from "../../hooks/useToggle";
import SoundSearch from "../SoundSearch";
import TextToSpeech from "../TextToSpeech";
import { Collapse, Navbar, NavbarToggler } from "reactstrap";

export default function Navigation(): ReactElement {
  const [toggled, toggle, toggleOf] = useToggle();

  return (
    <Navbar dark expand="md" color="dark" className="navigation">
      <NavBrandLink />
      <NavbarToggler type="button" onClick={toggle} />
      <Collapse isOpen={toggled} navbar className="justify-content-between">
        <MainMenu onLinkClick={toggleOf} />
        <SoundSearch />
        <TextToSpeech />
      </Collapse>
    </Navbar>
  );
}
