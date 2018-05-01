import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'
import SoundsNav from '.'

describe('@components/SoundsNav', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <SoundsNav tags={[]} />
            </MemoryRouter>
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })
})