import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers'; // Or wherever you keep your reducers

import './css/App.css';
import '@remy/react-splitter-layout/src/stylesheets/index.css';

import Result from './containers/Result';

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
</head>
<body>
<pre><code>
  can I steal content?
</code></pre>
</body>
</html>`;

const middleware = [];

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const finalCreateStore = compose(...middleware)(createStore);
const store = finalCreateStore(reducers);

const render = App => {
  ReactDOM.render(
    <Provider store={store}>
      <Result renderResult="both" result={html} html={html} />
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
