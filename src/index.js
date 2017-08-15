import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter, routerMiddleware, replace } from 'react-router-redux';

// middleware for store
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
// import { apiMiddleware } from 'redux-api-middleware';
import { middleware as reduxPackMiddleware } from 'redux-pack';

import Loadable from 'react-loadable';
import LoadingComponent from './components/Loading';

// utils/store setup
import restoreSettings, { getRawUserSettings } from './lib/settings';
import reducers from './reducers'; // Or wherever you keep your reducers
import { defaultState as defaultSessions } from './reducers/session';
import { defaultState as defaultApp } from './reducers/app';
import * as MODES from './lib/cm-modes';
import { RESULT_PAGE, RESULT_CONSOLE } from './actions/session';
import { setToken } from './actions/user';
import registerServiceWorker from './registerServiceWorker';
import jsbinMiddleware, { saveSettings } from './lib/jsbin-middleware';

const getLoadable = component =>
  Loadable({
    loader: () => import('./containers/' + component),
    loading: LoadingComponent,
  });

// main pages async loading 💪
const App = getLoadable('App');
const Settings = getLoadable('Settings');
const Welcome = getLoadable('Welcome');
const Login = getLoadable('Login');
const Account = getLoadable('Account');

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
const splitterWidth =
  loadFromStorage('splitter-width') || defaultSessions.splitterWidth;
initState.session = {
  ...defaultSessions,
  splitterWidth,
  result: initState.app.result,
};

/** FIXME bad, this is messy and hacky */
initState.user = {
  settings: getRawUserSettings(),
};
if (!initState.user.settings) {
  delete initState.user;
}

initState.app = { ...defaultApp, ...initState.app };

// FIXME find a home for this code
{
  // check the url and select the right panels
  const url = new URL(window.location.toString());

  const source = url.searchParams.get('source');
  if (source) {
    initState.app.source = source;
  }

  const result = url.searchParams.get('result');
  if (result) {
    initState.session.result = result;
  }

  // I hate past me for doing this…well I hate PHP for making me do this
  const display = decodeURIComponent(window.location.search.substring(1)).split(
    ','
  );

  if (display.includes('output')) {
    initState.session.result = RESULT_PAGE;
  }

  if (display.includes('console')) {
    initState.session.result = RESULT_CONSOLE;
  }

  Object.keys(MODES).forEach(mode => {
    const key = MODES[mode];
    if (display.includes(key)) {
      initState.app.source = key;
    }
  });

  if (display.includes('js')) {
    // super legacy 😢
    initState.app.source = MODES.JAVASCRIPT;
  }
}

const finalCreateStore = compose(...middleware)(createStore);
const store = finalCreateStore(reducers, initState);

// FIXME move
{
  // restore user

  const url = new URL(window.location.toString());
  let token = url.searchParams.get('token');
  if (token) {
    const qs = new URLSearchParams(window.location.search);
    qs.delete('token');
    store.dispatch(
      replace({
        search: qs.toString(),
      })
    );
  } else {
    try {
      token = JSON.parse(localStorage.getItem('jsbin.user-token'));
    } catch (e) {
      token = null;
    }
  }

  if (token) {
    store.dispatch(setToken(token));
  }
}

saveSettings(store);

const render = App => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/welcome" component={Welcome} />
          <Route exact path="/login" component={Login} />
          <Route path="/account/" component={Account} />

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
