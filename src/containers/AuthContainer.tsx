import * as React from 'react'
import { User } from 'firebase'
import auth, { Auth } from '../lib/auth'

export interface Props {
    children(user: User | null, auth: Auth): React.ReactElement<any>
}

export interface State {
    user: User | null
}

export default class AuthContainer extends React.PureComponent<Props, State> {
    private mounted: boolean = false

    constructor(props: Props) {
        super(props)

        this.state = {
            user: auth.getAuth().currentUser
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true

        auth.getAuth().onAuthStateChanged(user => {
            if (!this.mounted) {
                return
            }

            user
                ? this.setState({ user })
                : this.setState({ user: null })
        })
    }

    render() {
        return this.props.children(this.state.user, auth)
    }
}