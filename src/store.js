import reducers from './reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

const middleware = [
  applyMiddleware(thunkMiddleware),
  applyMiddleware(promise),
  applyMiddleware(() => next => action => {
    const nextAction = next(action);
    // const state = store.getState(); // new state after action was applied

    // if (action.type in progressEvents) {
    //   saveProgress(state.course.id, state.user.token, state.progress);
    // }

    // if (action.type in userEvents) {
    //   saveUser(state.user.token, state.user);
    // }

    return nextAction;
  })
];

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const finalCreateStore = compose(...middleware)(createStore);

const store = finalCreateStore(reducers);

if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.user) {
  // store.dispatch(setUserToken(window.__PRELOADED_STATE__.user.token));
} else {
  // store.dispatch(restoreUserToken());
}

export default store;
