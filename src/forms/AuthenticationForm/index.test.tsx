import * as React from 'react'
import * as renderer from 'react-test-renderer'
import AuthenticationForm from '.'

describe('@forms/AuthenticationForm', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <AuthenticationForm 
                onSubmit={(emai: string, password: string): Promise<any> => new Promise(() => {})}
            />
        ).toJSON()
        
        expect(tree).toMatchSnapshot()
    })
})