/* eslint-env jest */
import React from 'react';
import { prepareBeforeEach, mount } from '../../../config/jest-app';
import Advert from '../Advert';
import App from '../../containers/App';

jest.mock('../Mirror');

beforeEach(() => {
  prepareBeforeEach({ app: { showWelcome: false } });
});

test('ad url is only loaded once', () => {
  const spy = jest.spyOn(Advert.prototype, 'componentDidMount');

  const app = mount(App);

  const advert = app.find('Advert');

  expect(advert.length).toBe(1);

  expect(spy).toHaveBeenCalled();
});
