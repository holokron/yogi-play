import { applyMiddleware, compose, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import appReducer from './reducer'
import AppState, { initialState } from './state'

const middleware = applyMiddleware(thunk)

const enhancer = process.env.NODE_ENV === 'development'
    ? composeWithDevTools(middleware)
    : compose(middleware)

export default function configureStore(state: AppState = initialState): Store {
    const store = createStore(appReducer, state, enhancer)

    return store
}