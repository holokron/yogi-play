import * as React from 'react'
import AppState from '../store/state'
import { getUser } from '../store/selectors'
import User from '../types/User'
import { connect } from 'react-redux'

interface OwnProps {
    children: {(user: User | null): React.ReactElement<any> | null}
}

interface StateProps {    
    user: User | null
}

export type Props = OwnProps & StateProps

function UserContainer({ children, user }: Props): React.ReactElement<Props> | null {
    return children(user)
}

const mapStateToProps = (state: AppState) => ({
    user: getUser(state),
})

export default connect<StateProps, {}, OwnProps>(mapStateToProps)(UserContainer)