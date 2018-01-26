/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';
import thunk from 'redux-thunk';

import { defaultState as editor } from '../../reducers/editor';
import { defaultState as app } from '../../reducers/app';
import { defaultState as session } from '../../reducers/session';
import { defaultState as bin } from '../../reducers/bin';
import { defaultState as user } from '../../reducers/user';
import { defaultState as processors } from '../../reducers/processors';

import Advert from '../Advert';
import App from '../../containers/App';

process.on('unhandledRejection', err => {
  throw err;
});

jest.mock('../Mirror');

const mockStore = configureMockStore([thunk]);
let store;
let history;

beforeEach(() => {
  history = createHistory();
  store = mockStore({
    processors,
    editor,
    notifications: [],
    snippets: [],
    bin,
    session,
    user,
    app: { ...app, showWelcome: false },
  });
});

test('ad url is only loaded once', () => {
  const spy = jest.spyOn(Advert.prototype, 'componentDidMount');

  const noop = () => {};

  const props = {
    match: { params: '' },
    fetch: noop,
    location: '/',
  };

  const app = mount(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App {...props} />
      </ConnectedRouter>
    </Provider>
  );

  const advert = app.find('Advert');

  expect(advert.length).toBe(1);

  expect(spy).toHaveBeenCalled();
});
