import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '.'
import configureStore from '../../store'
import { Provider } from 'react-redux'

const store = configureStore()

describe('@components/Navigation', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Provider store={store}>
                <MemoryRouter>
                    <Navigation />
                </MemoryRouter>
            </Provider>
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })

    it('should toggle menu', () => {
        const result = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <Navigation />
                </MemoryRouter>
            </Provider>
        )

        expect(result.find('div.navbar-collapse.collapse.show')).toHaveLength(0)

        result.find('button.navbar-toggler').simulate('click')

        expect(result.find('div.navbar-collapse.collapsing')).toHaveLength(1)
    })    
})