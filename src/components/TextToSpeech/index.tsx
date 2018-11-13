import * as React from 'react'
import { Form, Input, InputGroup, InputGroupAddon, Button, Nav } from 'reactstrap'

export default function TextToSpeech(): React.ReactElement<{}> {
    return (
        <Nav navbar className="mr-auto">
            <Form inline>
                <InputGroup>
                    <Input bsSize="sm" defaultValue="wpisz tekst" />
                    <InputGroupAddon addonType="append">
                        <Button color="primary" size="sm" >Czytaj</Button>
                    </InputGroupAddon>
                </InputGroup>
            </Form>
        </Nav>
    )
}