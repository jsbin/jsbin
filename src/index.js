import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

function render(App) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const App = require('./App').default;
    render(App);
  });
}

registerServiceWorker();
