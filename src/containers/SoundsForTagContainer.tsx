import * as React from 'react'
import Tag from '../types/Tag'
import Sound from '../types/Sound'
import AppState from '../store/state'
import { createGetSoundsForTag } from '../store/selectors'
import { connect } from 'react-redux'

export interface Props {
    children: (sounds: Sound[]) => React.ReactElement<any> 
    tag: Tag | null,
    sounds?: Sound[]
}

function SoundsForTagContainer({ children, sounds = [] }: Props): React.ReactElement<Props> {
    return children(sounds)
}

const mapStateToProps = (state: AppState, { tag = null }: Props) => {
    if (!tag) {
        return {
            sounds: [],
        }
    }
    const getSoundsForTags = createGetSoundsForTag(tag)

    return {
        sounds: getSoundsForTags(state),
    }
}

export default connect(mapStateToProps)(SoundsForTagContainer)