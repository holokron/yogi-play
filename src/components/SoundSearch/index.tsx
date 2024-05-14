import { useCallback, SyntheticEvent, ReactElement } from "react";
import "./index.css";
import { Nav, Form, InputGroup, Input } from "reactstrap";
import useSoundSearch from "@/hooks/useSoundSearch";
import { CommandMenu } from "../CommandMenu";

export default function SoundSearch(): ReactElement {
  const { onChange } = useSoundSearch();

  const handleChange = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      event.preventDefault();

      onChange(event.currentTarget.value);
    },
    [onChange]
  );

  return (
    <>
      <Nav navbar className="mr-auto">
        <Form noValidate>
          <InputGroup>
            <Input
              bsSize="sm"
              className="input-rounded"
              onChange={handleChange}
              placeholder="szukaj dżwięku"
              type="search"
            />
          </InputGroup>
        </Form>
      </Nav>
      <CommandMenu />
    </>
  );
}
