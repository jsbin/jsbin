/*global test */
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../containers/App';
import * as bin from '../../lib/Defaults';
import { defaultState as session } from '../../reducers/session';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();

test('renders without crashing', () => {
  const div = document.createElement('div');
  const store = mockStore({
    bin,
    session,
    app: { splitColumns: true },
  });
  ReactDOM.render(<App store={store} />, div);
});
