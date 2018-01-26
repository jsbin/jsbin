/* eslint-env jest */
import React from 'react';
import { prepareBeforeEach, mount } from '../../../config/jest-app';
import Advert from '../Advert';
import App from '../../containers/App';

jest.mock('../Mirror');

const state = [];

const middleware = store => next => action => {
  state.push(action.type);
  return next(action);
};

beforeEach(() => {
  prepareBeforeEach({ app: { showWelcome: false }, middleware: [middleware] });
});

test('state stack matches a browser', () => {
  const app = mount(App);
  expect(state.length).not.toBe(0);
  expect(state.includes('@@processor/set/RESULT')).toBe(true);
});
