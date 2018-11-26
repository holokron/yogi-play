import * as React from 'react'
import Navigation from '../../components/Navigation'

export interface Props {
    children?: any
}

export default function DefaultTemplate ({ children }: Props): React.ReactElement<Props> {
    return (
        <React.Fragment>
            <Navigation />
            {children}
        </React.Fragment>
    )
}