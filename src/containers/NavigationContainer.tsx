import * as React from 'react'
import AuthContainer from './AuthContainer'
import Navigation from '../components/Navigation'

export default function() {
    return (
        <AuthContainer>
            {(user, auth) => <Navigation user={user} logout={auth.logout} />}
        </AuthContainer>
    )
}
