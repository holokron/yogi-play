import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '.'

describe('@components/Navigation', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })

    it('should toggle menu', () => {
        const result = mount(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        )

        expect(result.find('div.navbar-collapse.collapse.show')).toHaveLength(0)

        result.find('button').simulate('click')

        expect(result.find('div.navbar-collapse.collapsing')).toHaveLength(1)
    })    
})