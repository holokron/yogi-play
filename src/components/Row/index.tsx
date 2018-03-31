import * as React from 'react'

export interface Props {
    children?: any
    withTopPadding?: boolean
}

export default function Row({ children, withTopPadding = false }: Props): React.ReactElement<Props> {
    let className: string = 'row justify-content-md-center pl-3 pr-3'

    if (withTopPadding) {
        className += ' pt-4'
    }

    return <div className={className}>{children}</div>
}