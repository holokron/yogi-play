import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import Row from '.'

describe('@components/Row', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Row>Test</Row>
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })

    it('should render without errors', () => {
        expect(
            shallow(
                <Row>Test</Row>
            ).matchesElement(
                <div className="row justify-content-md-center pl-3 pr-3">Test</div>
            )
        ).toBeTruthy()
    })
    
    it('should render without errors, props (withTopPadding = true)', () => {
        expect(
            shallow(
                <Row withTopPadding>Test</Row>
            ).matchesElement(
                <div className="row justify-content-md-center pl-3 pr-3 pt-4">Test</div>
            )
        ).toBeTruthy()
    })
})