import React, { useCallback, SyntheticEvent, ReactElement } from "react";
import "./index.css";
import { Nav, Form, InputGroup, Input } from "reactstrap";

export interface SoundSearchProps {
  onChange: { (query: string | null): void };
  query: string | null;
}

export default function SoundSearch({
  onChange,
  query
}: SoundSearchProps): ReactElement<SoundSearchProps> {
  const handleChange = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      event.preventDefault();

      onChange(event.currentTarget.value);
    },
    [onChange]
  );

  return (
    <Nav navbar>
      <Form inline noValidate>
        <InputGroup>
          <Input
            value={query || ""}
            bsSize="sm"
            className="input-rounded"
            onChange={handleChange}
            placeholder="szukaj dżwięku"
            type="search"
          />
        </InputGroup>
      </Form>
    </Nav>
  );
}
