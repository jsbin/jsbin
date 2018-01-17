import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import runnerMiddleware from './lib/runner-middleware';
import app from './reducers/app';
import processors from './reducers/processors';
import session from './reducers/session';

import './css/App.css';
import '@remy/react-splitter-layout/src/stylesheets/index.css';

import Result from './containers/Result';

const middleware = [applyMiddleware(thunk), applyMiddleware(runnerMiddleware)];

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const finalCreateStore = compose(...middleware)(createStore);
const store = finalCreateStore(
  combineReducers({
    app,
    processors,
    session,
  })
);

const render = App => {
  ReactDOM.render(
    <Provider store={store}>
      <Result />
    </Provider>,
    document.getElementById('root')
  );
};

render(Result);

if (module.hot) {
  module.hot.accept('./containers/Result', () => {
    const Result = require('./containers/Result').default;
    render(Result);
  });
}

// registerServiceWorker();
