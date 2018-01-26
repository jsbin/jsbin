/*global test */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from '../../containers/App';
import * as bin from '../../lib/Defaults';
import { defaultState as session } from '../../reducers/session';
import { defaultState as processors } from '../../reducers/processors';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const mockStore = configureMockStore([thunk]);
const history = createHistory();

test('renders without crashing', () => {
  const div = document.createElement('div');
  const store = mockStore({
    bin,
    session,
    processors,
    app: { splitColumns: true },
  });

  const props = {
    location: '/',
  };

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App {...props} />
      </ConnectedRouter>
    </Provider>,
    div
  );
});
