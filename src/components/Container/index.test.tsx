import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import Container from '.'

describe('@components/Container', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Container>Test</Container>
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })

    it('should render without errors', () => {
        expect(
            shallow(
                <Container>Test</Container>
            ).matchesElement(
                <div className="pt-4 container">Test</div>
            )
        ).toBeTruthy()

    })

    it('should render without errors (fluid = true)', () => {
        expect(
            shallow(
                <Container fluid>Test</Container>
            ).matchesElement(
                <div className="pt-4 container-fluid">Test</div>
            )
        ).toBeTruthy()
    })
})