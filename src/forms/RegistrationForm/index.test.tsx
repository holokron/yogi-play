import * as React from 'react'
import * as renderer from 'react-test-renderer'
import RegistrationForm from '.'

describe('@forms/RegistrationForm', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <RegistrationForm 
                onSubmit={(emai: string, password: string): Promise<any> => new Promise(() => {})}
            />
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })
})