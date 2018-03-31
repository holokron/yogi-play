import * as React from 'react'
import { Nav } from 'reactstrap'

export interface Props {
    children?: any
}

export default function SoundsNav({ children = null }: Props) {
    return (
        <Nav pills className="pl-2 pr-2">
            {children}
        </Nav>
    )
}