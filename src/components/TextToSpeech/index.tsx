import React, {
  ReactElement,
  useCallback,
  FormEvent,
  useState,
  ChangeEvent,
} from "react";
import Form from "reactstrap/lib/Form";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import Button from "reactstrap/lib/Button";
import Nav from "reactstrap/lib/Nav";
import "./index.css";
import useTextToSpeech from "../../hooks/useTextToSpeech";

export default function TextToSpeech(): ReactElement {
  const [text, setText] = useState<string | null>(null);

  const handleChangeText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      setText(event.currentTarget.value);
    },
    [setText]
  );

  const { readText } = useTextToSpeech();

  const handleReadText = useCallback(
    (event: FormEvent<HTMLFormElement> | MouseEvent | TouchEvent) => {
      event.preventDefault();

      readText(text || "");
    },
    [readText, text]
  );

  return (
    <Nav navbar>
      <Form onSubmit={handleReadText} inline noValidate>
        <InputGroup>
          <Input
            bsSize="sm"
            className="input-rounded-left"
            onChange={handleChangeText}
            placeholder="wpisz tekst"
          />
          <InputGroupAddon addonType="append">
            <Button
              className="button-rounded-right"
              color="primary"
              onClick={handleReadText}
              size="sm"
            >
              Czytaj
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </Form>
    </Nav>
  );
}
