import * as React from 'react'
import NavigationContainer from '../../containers/NavigationContainer'

export interface Props {
    children?: any
}

export default function DefaultTemplate ({ children }: Props): React.ReactElement<Props> {
    return (
        <React.Fragment>
            <NavigationContainer />
            {children}
        </React.Fragment>
    )
}