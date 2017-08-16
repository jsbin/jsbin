/*global test */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from '../../containers/App';
import * as bin from '../../lib/Defaults';
import { defaultState as session } from '../../reducers/session';
import { defaultState as processors } from '../../reducers/processors';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const mockStore = configureMockStore([thunk]);

test('renders without crashing', () => {
  const div = document.createElement('div');
  const store = mockStore({
    bin,
    session,
    processors,
    app: { splitColumns: true },
  });
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
});
