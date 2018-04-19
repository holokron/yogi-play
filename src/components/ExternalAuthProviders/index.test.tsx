import * as React from 'react'
import * as renderer from 'react-test-renderer'
import ExternalAuthProviders from '.'

describe('@components/ExternalAuthProviders', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <ExternalAuthProviders
                googleLoginLabel="Login with Google"
                facebookLoginLabel="Login with Facebook"
                onLoginWithGoogle={async () => {}}
                onLoginWithFacebook={async () => {}}
            />
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })
})