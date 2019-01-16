import * as React from 'react'
import Tag from '../types/Tag'
import AppState from '../store/state'
import { getTagsByOrder } from '../store/selectors'
import { connect } from 'react-redux'

interface OwnProps {
    children: (tags: Tag[]) => React.ReactElement<any> 
}

interface StateProps {
    tags: Tag[],
}

export type Props = OwnProps & StateProps

function TagsContainer({ children, tags = [] }: Props): React.ReactElement<Props> {
    return children(tags)
}

const mapStateToProps = (state: AppState) => ({
    tags: getTagsByOrder(state),
})

export default connect<StateProps, {}, OwnProps, AppState>(mapStateToProps)(TagsContainer)