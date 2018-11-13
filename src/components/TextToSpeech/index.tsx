import * as React from 'react'
import { connect } from 'react-redux'
import { Form, Input, InputGroup, InputGroupAddon, Button, Nav } from 'reactstrap'
import './index.css'
import { readText, AppDispatch } from '../../store/actions'

export interface Props {
    readText: {(text: string): void}
}

export interface State {
    text: string | null
}

class TextToSpeech extends React.PureComponent<Props, State> {
    public state: State = {
        text: null,
    }

    constructor(props: Props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    public handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault()

        this.setState({
            text: event.currentTarget.value,
        })
    }

    public handleClick(event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>): void {
        event.preventDefault()

        this.readText()
    }

    public handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault()

        this.readText()
    }

    public render() {
        return (
            <Nav navbar className="mr-auto">
                <Form onSubmit={this.handleSubmit} inline noValidate>
                    <InputGroup>
                        <Input
                            bsSize="sm"
                            className="input-rounded-left"
                            onChange={this.handleChange}
                            placeholder="wpisz tekst"
                        />
                        <InputGroupAddon addonType="append">
                            <Button
                                className="button-rounded-right"
                                color="primary"
                                onClick={this.handleClick}
                                size="sm"
                            >
                                Czytaj
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Form>
            </Nav>
        )
    }

    private readText(): void {
        if (!this.state.text) {
            return
        }

        this.props.readText(this.state.text)
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    readText: (text: string): void => {
        dispatch(readText(text))
    },
})

export default connect(null, mapDispatchToProps)(TextToSpeech)