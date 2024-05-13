import {
  ReactElement,
  useCallback,
  useState,
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from "react";
import "./index.css";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import { Button, Form, Input, InputGroup, Nav } from "reactstrap";

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
    (event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      readText(text || "");
    },
    [readText, text]
  );

  return (
    <Nav navbar>
      <Form onSubmit={handleReadText} noValidate>
        <InputGroup>
          <Input
            bsSize="sm"
            className="input-rounded-left"
            onChange={handleChangeText}
            placeholder="wpisz tekst"
            addon
          />
          <Button
            className="button-rounded-right"
            color="primary"
            onClick={handleReadText}
            size="sm"
          >
            Czytaj
          </Button>
        </InputGroup>
      </Form>
    </Nav>
  );
}
