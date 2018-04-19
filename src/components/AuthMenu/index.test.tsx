import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'
import AuthMenu from '.'

describe('@components/AuthMenu', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <AuthMenu />
            </MemoryRouter>
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })
})