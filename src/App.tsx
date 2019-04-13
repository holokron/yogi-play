import * as React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Sounds from './routes/Sounds'
import Favourites from './routes/Favourites'
import Request from './routes/Request'
import Footer from './components/Footer'
import configureStore from './store'

export const APP_NAME = 'Yogi PLAY'
export const APP_VERSION = '0.29.0'

const store = configureStore()

class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <React.Fragment>
            <main>
              <Switch>
                <Route exact path="/" component={Sounds} />
                <Route exact path="/ulubione" component={Favourites} />
                <Route exact path="/dodaj" component={Request} />
              </Switch>
            </main>
            <Footer>
              v{APP_VERSION}&nbsp;
            </Footer>
          </React.Fragment>
        </Router>
      </Provider>
    )
  }
}

export default App
