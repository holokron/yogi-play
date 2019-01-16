import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './icons'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css/animate.min.css'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()
