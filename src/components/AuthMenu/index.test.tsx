import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import AuthMenu from '.'
import configureStore from '../../store'
import { initialState } from '../../store/state'

const store = configureStore({
    ...initialState,
    user: {
        id: 'foo',
        displayName: 'Foo Bar',
        email: 'foo@bar.com',
    },
})

describe('@components/AuthMenu', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Provider store={store}>
                <MemoryRouter>
                    <AuthMenu />
                </MemoryRouter>
            </Provider>
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })
})