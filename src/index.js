import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';

// middleware for store
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
// import { apiMiddleware } from 'redux-api-middleware';
import { middleware as reduxPackMiddleware } from 'redux-pack';

import reducers from './reducers'; // Or wherever you keep your reducers
import App from './containers/App';
import * as MODES from './lib/cm-modes';
import { setSource } from './actions/editor';
import { RESET } from './actions/bin';
import registerServiceWorker from './registerServiceWorker';
import jsbinMiddleware from './lib/jsbin-middleware';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const historyMiddleware = routerMiddleware(history);

const middleware = [
  applyMiddleware(thunk),
  applyMiddleware(reduxPackMiddleware),
  applyMiddleware(jsbinMiddleware),
  applyMiddleware(historyMiddleware),
];

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const initState = {};

try {
  const key = 'editor';
  const value = localStorage.getItem(`jsbin.${key}`);
  if (value) {
    initState[key] = JSON.parse(value);
  }
} catch (e) {
  console.log('failed to restore state', e);
}

// NOTE I don't really know why I couldn't do
// `createStore(reducers, applyMiddleware(...middleware))`
// but it just didn't want to fly
const finalCreateStore = compose(...middleware)(createStore);
const store = finalCreateStore(reducers, initState);

const url = new URL(window.location.toString());

Object.keys(MODES).forEach(mode => {
  const key = MODES[mode];
  if (url.searchParams.get(key) !== null) {
    store.dispatch(setSource(key));
  }
});

const resetBin = nextState => {
  const { dispatch } = store;
  console.log('resetting');

  dispatch({ type: RESET });
};

const render = App => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <Route exact onEnter={resetBin} path="/" component={App} />
          <Route
            exact
            onEnter={resetBin}
            path="/:bin/:version"
            component={App}
          />
          <Route exact onEnter={resetBin} path="/:bin" component={App} />
        </div>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const App = require('./containers/App').default;
    render(App);
  });
}

registerServiceWorker();
