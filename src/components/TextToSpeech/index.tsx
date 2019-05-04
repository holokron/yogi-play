import React, {
  ReactElement,
  useCallback,
  FormEvent,
  useState,
  ChangeEvent
} from "react";
import Form from "reactstrap/lib/Form";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import Button from "reactstrap/lib/Button";
import Nav from "reactstrap/lib/Nav";
import "./index.css";

export interface TextToSpeechProps {
  readText: { (text: string): void };
}

export default function TextToSpeech({
  readText
}: TextToSpeechProps): ReactElement<TextToSpeechProps> {
  const [text, setText] = useState<string | null>(null);

  const handleChangeText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      setText(event.currentTarget.value);
    },
    [setText]
  );

  const handleReadText = useCallback(
    (event: FormEvent<HTMLFormElement> | MouseEvent | TouchEvent) => {
      event.preventDefault();

      readText(text || "");
    },
    [readText, text]
  );

  return (
    <Nav navbar className="mr-auto">
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
