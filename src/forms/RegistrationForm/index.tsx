import * as React from 'react'
import { Button, FormGroup, Input, UncontrolledAlert } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface Props {
    onSubmit(email: string, password: string): Promise<any>
}

export interface State {
    email: any
    password: any
    isLoading: boolean
    error: boolean
}

export default class RegistrationForm extends React.PureComponent<Props, State> {
    state: State = {
        email: '',
        password: '',
        isLoading: false,
        error: false,
    }

    constructor(props: Props) {
        super(props)

        this.handleChangeEmail = this.handleChangeEmail.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            email: event.target.value,
            error: false,
        })
    }

    handleChangePassword(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            password: event.target.value,
            error: false,
        })
    }

    async handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        this.setState({
            isLoading: true,
            error: false,
        })

        const {
            email,
            password,
        } = this.state

        try {
            await this.props.onSubmit(email, password)
        } catch (error) {
            this.setState({
                isLoading: false,
                error: true,
            })
        }
    }

    renderErrors() {
        if (!this.state.error) {
            return null
        }

        return (
            <UncontrolledAlert color="danger">
                Nieprawidłowy email i/lub hasło
            </UncontrolledAlert>
        )
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} noValidate>
                {this.renderErrors()}
                <FormGroup>
                    <label>Email</label>
                    <Input
                        type="email" 
                        name="email" 
                        placeholder="Email"
                        onChange={this.handleChangeEmail}
                        value={this.state.email}
                    />
                </FormGroup>
                <FormGroup>
                    <label>Hasło</label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Hasło"
                        onChange={this.handleChangePassword}
                        value={this.state.password}
                    />
                </FormGroup>
                <Button color="primary" type="submit">
                    {this.state.isLoading 
                        ? <React.Fragment>
                            <FontAwesomeIcon icon="spinner" fixedWidth pulse /> Przetwarzanie...
                            </React.Fragment>
                        : 'Zarejestruj'
                    }
                </Button>
            </form>
        )
    }
}