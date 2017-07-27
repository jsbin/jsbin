import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';

// FIXME remove on live
import Perf from 'react-addons-perf';

// middleware for store
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
// import { apiMiddleware } from 'redux-api-middleware';
import { middleware as reduxPackMiddleware } from 'redux-pack';

// main pages
import App from './containers/App';
import Settings from './containers/Settings';

// utils/store setup
import restoreSettings, { getRawUserSettings } from './lib/settings';
import reducers from './reducers'; // Or wherever you keep your reducers
import { defaultState as defaultSessions } from './reducers/session';
import * as MODES from './lib/cm-modes';
import { OUTPUT_PAGE, OUTPUT_CONSOLE, changeOutput } from './actions/session';
import { setSource } from './actions/app';
import registerServiceWorker from './registerServiceWorker';
import jsbinMiddleware from './lib/jsbin-middleware';

window.Perf = Perf;

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

const loadFromStorage = (localStorageKey, defaults = {}) => {
  try {
    let value = localStorage.getItem(`jsbin.${localStorageKey}`);
    if (value) {
      value = JSON.parse(value);
      if (value.toString() === '[Object object]') {
        return { ...defaults, ...value };
      } else {
        return value;
      }
    }
  } catch (e) {
    console.log('failed to restore state', e);
  }
};

// TODO consider looking at/using redux-persist, for now though, let's reinvent
// some wheels!
const initState = restoreSettings();
const splitterWidth = loadFromStorage('splitter-width');
if (splitterWidth) {
  initState.session = {
    ...defaultSessions,
    splitterWidth,
  };
}

/** FIXME bad, this is messy and hacky */
initState.user = {
  settings: getRawUserSettings(),
};
if (!initState.user.settings) {
  delete initState.user;
}

// NOTE I don't really know why I couldn't do
// `createStore(reducers, applyMiddleware(...middleware))`
// but it just didn't want to fly
const finalCreateStore = compose(...middleware)(createStore);
const store = finalCreateStore(reducers, initState);

// FIXME move this out of index.js
{
  const url = new URL(window.location.toString());

  const showOutput = url.searchParams.get('output');
  if (showOutput !== null) {
    if (showOutput === '' || showOutput === 1) {
      store.dispatch(changeOutput(OUTPUT_PAGE));
    }
  }

  const showConsole = url.searchParams.get('console');
  if (showConsole !== null) {
    if (showConsole === '' || showConsole === 1) {
      store.dispatch(changeOutput(OUTPUT_CONSOLE));
    }
  }

  Object.keys(MODES).forEach(mode => {
    const key = MODES[mode];
    if (url.searchParams.get(key) !== null) {
      store.dispatch(setSource(key));
    }
  });
}

const render = App => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/settings" component={Settings} />
          <Route
            exact
            path="/welcome"
            component={require('./components/Welcome').default}
          />

          <Route
            exact
            path="/404"
            component={require('./components/GenericErrorPage').default}
          />
          <Route
            exact
            path="/loading"
            component={require('./components/Loading').default}
          />
          <Route exact path="/local/:localId" component={App} />
          <Route exact path="/gist/:gistId" component={App} />
          <Route exact path="/:bin/:version" component={App} />
          <Route exact path="/:bin" component={App} />
        </Switch>
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
