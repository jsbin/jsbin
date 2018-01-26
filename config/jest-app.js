/* eslint-env jest */
import React from 'react';
import { mount as _mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';
import thunk from 'redux-thunk';

import { defaultState as _editor } from '../src/reducers/editor';
import { defaultState as _app } from '../src/reducers/app';
import { defaultState as _session } from '../src/reducers/session';
import { defaultState as _bin } from '../src/reducers/bin';
import { defaultState as _user } from '../src/reducers/user';
import { defaultState as _processors } from '../src/reducers/processors';
const _notifications = [];
const _snippets = {};

const mockStore = configureMockStore([thunk]);
let store;
let history;

export const prepareBeforeEach = (
  {
    app = {},
    bin = {},
    editor = {},
    notifications = [],
    processors = {},
    session = {},
    snippets = {},
    user = {},
  } = {}
) => {
  history = createHistory();
  store = mockStore({
    app: { ..._app, ...app },
    bin: { ..._bin, ...bin },
    editor: { ..._editor, ...editor },
    notifications: [..._notifications, ...notifications],
    processors: { ..._processors, ...processors },
    session: { ..._session, ...session },
    snippets: { ..._snippets, ...snippets },
    user: { ..._user, ...user },
  });
};

const noop = () => {};

const props = {
  match: { params: '' },
  fetch: noop,
  location: '/',
};

export const mount = App =>
  _mount(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App {...props} />
      </ConnectedRouter>
    </Provider>
  );
