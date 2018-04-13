import * as React from 'react'

export interface Props {
    children(
        toggled: boolean,
        toggle: Function,
        toggleOn: Function,
        toggleOff: Function,
    ): React.ReactElement<any>
}

export interface State {
    toggled: boolean
}

export default class ToggleContainer extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            toggled: false,
        }

        this.toggle = this.toggle.bind(this)
        this.toggleOff = this.toggleOff.bind(this)
        this.toggleOn = this.toggleOn.bind(this)
    }

    toggle() {
        this.setState((state: State) => ({
            toggled: !state.toggled,
        }))
    }

    toggleOff() {
        this.setState({
            toggled: false,
        })
    }

    toggleOn() {
        this.setState({
            toggled: true,
        })
    }

    render() {
        const {
            props: {
                children,
            },
            state: {
                toggled,
            },
            toggle,
            toggleOff,
            toggleOn,
        } = this

        return children(toggled, toggle, toggleOff, toggleOn)
    }
}