import { applyMiddleware, compose, createStore, Store } from "redux";
import { thunk, ThunkDispatch } from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";
import appReducer from "./reducer";
import AppState, { initialState } from "./state";
import { AppAction } from "./actions";

const middleware = applyMiddleware(thunk);

const enhancer = compose(middleware);
  // import.meta.env.NODE_ENV === "development"
  //   ? composeWithDevTools(middleware)
  //   : compose(middleware);

export type AppDispatch = ReturnType<typeof configureStore>["dispatch"];
export type AppThunkDispatch = ThunkDispatch<AppState, undefined, AppAction>;

export default function configureStore(
  state: AppState = initialState
): Store<AppState, AppAction> {
  const store = createStore(appReducer, state, enhancer);

  return store;
}
