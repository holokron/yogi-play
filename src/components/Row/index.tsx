import * as React from 'react'

export interface Props {
    children?: any
    className?: string
    withTopPadding?: boolean
}

export default function Row({ children, className = '', withTopPadding = false }: Props): React.ReactElement<Props> {
    if (withTopPadding) {
        className += ' pt-4'
    }

    return <div className={`row justify-content-md-center pl-3 pr-3 ${className}`}>{children}</div>
}