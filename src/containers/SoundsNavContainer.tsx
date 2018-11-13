import * as React from 'react'
import { connect } from 'react-redux'
import { getChosenTag, getTagsByOrder } from '../store/selectors'
import { AppDispatch, chooseTag } from '../store/actions'
import AppState from '../store/state'
import SoundsNav, { Props } from '../components/SoundsNav'

function SoundsNavContainer({ changeTag, currentTag, tags }: Props): React.ReactElement<Props> {
    return (
        <SoundsNav
            tags={tags}
            currentTag={currentTag}
            changeTag={changeTag}
        />
    )
}

const mapStateToProps = (state: AppState) => ({
    currentTag: getChosenTag(state),
    tags: getTagsByOrder(state),
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    changeTag: (tagSlug: string): void => {
        dispatch(chooseTag(tagSlug))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(SoundsNavContainer)