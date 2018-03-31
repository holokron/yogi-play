import * as React from 'react'

export interface Props {
    children?: any
}

export default function Footer({ children = null }: Props) {
    return (
        <p className="text-muted text-center mt-4">
            {children}
            &copy;&nbsp;
            <a className="text-muted" href="mailto:michalv8@gmail.com">Yogi</a>
        </p>
    )
}