import * as React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Sounds from './routes/Sounds'
import Favourities from './routes/Favourities'
import Request from './routes/Request'
import Authentication from './routes/Authentication'
import Registration from './routes/Registration'
import SecuredRoute from './routes/SecuredRoute'
import Footer from './components/Footer'

export const APP_NAME = 'Yogi PLAY'
export const APP_VERSION = '0.19.0'

class App extends React.PureComponent {
  render() {
    return (
        <Router>
          <React.Fragment>
            <main>
              <Switch>
                <Route exact path="/" component={Sounds} />
                <SecuredRoute exact path="/ulubione" component={Favourities} />
                <Route exact path="/dodaj" component={Request} />
                <Route exact path="/logowanie" component={Authentication} />
                <Route exact path="/rejestracja" component={Registration} />
              </Switch>
            </main>
            <Footer>
              v{APP_VERSION}&nbsp;
            </Footer>
          </React.Fragment>
        </Router>
    )
  }
}

export default App
