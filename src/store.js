import reducers from './reducers';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import promise from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

export const history = createHistory();

const middleware = [
  // applyMiddleware(routerMiddleware(history)),
  applyMiddleware(thunkMiddleware),
  applyMiddleware(promise),
  applyMiddleware(() => next => action => {
    const nextAction = next(action);

    /** keeping this for future use so we can use state to save */
    // const state = store.getState(); // new state after action was applied
    // if (action.type in progressEvents) {
    //   saveProgress(state.course.id, state.user.token, state.progress);
    // }

    return nextAction;
  })
];

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

// export const store = createStore(
//   combineReducers({
//     ...reducers,
//     router: routerReducer
//   }),
//   ...middleware
// );

const finalCreateStore = combineReducers({
  ...reducers
  // router: routerReducer
});

export const store = createStore(finalCreateStore, ...middleware);

if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.user) {
  // store.dispatch(setUserToken(window.__PRELOADED_STATE__.user.token));
} else {
  // store.dispatch(restoreUserToken());
}
