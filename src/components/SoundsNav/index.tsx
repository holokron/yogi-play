import * as React from 'react'
import { Nav } from 'reactstrap'
import './index.css'
import SoundNavItem from '../../components/SoundNavItem'
import Tag from '../../types/Tag'

export interface Props {
    currentTag?: Tag | null
    tags: Tag[]
    changeTag?: Function
}

export default function SoundsNav({ changeTag = () => {}, currentTag = null, tags = [] }: Props) {
    return (
        <Nav pills className="sounds-nav">
            {tags.map((tag: Tag) =>
                <SoundNavItem
                    key={tag.id}
                    onClick={() => changeTag(tag)}
                    isActive={!!currentTag && currentTag.id === tag.id}
                >
                    {tag.name}
                </SoundNavItem>
            )}
        </Nav>
    )
}