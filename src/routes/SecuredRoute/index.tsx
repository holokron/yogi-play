import * as React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'
import AuthContainer from '../../containers/AuthContainer'

export default function SecuredRoute({ component, ...props }: RouteProps): React.ReactElement<RouteProps> {
    return (
      <AuthContainer>
        {(user) => {
          const from: string = props.location 
            ? props.location.pathname
            : '/'

          if (!user) {
            return (
              <Redirect 
                to={{
                  pathname: '/logowanie',
                  state: {
                    referrer: from,
                  },
                }} 
              />
            )
          }

          return <Route component={component} {...props} />
        }}
      </AuthContainer>
    )
  }