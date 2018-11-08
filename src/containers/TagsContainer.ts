import * as React from 'react'
import Tag from '../types/Tag'
import AppState from '../store/state'
import { getTagsByOrder } from '../store/selectors'
import { connect } from 'react-redux'

export interface Props {
    children: (tags: Tag[]) => React.ReactElement<any> 
    tags: Tag[],
}

function TagsContainer({ children, tags = [] }: Props): React.ReactElement<Props> {
    return children(tags)
}

const mapStateToProps = (state: AppState) => ({
    tags: getTagsByOrder(state),
})

export default connect(mapStateToProps)(TagsContainer)