import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'
import MainMenu from '.'

describe('@components/MainMenu', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <MainMenu />
            </MemoryRouter>
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })
})