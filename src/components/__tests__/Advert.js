/* eslint-env jest */
import React from 'react';
import { prepareBeforeEach, mount } from '../../../config/jest-app';
import Advert from '../Advert';
import App from '../../containers/App';

jest.mock('../Mirror');

const mockData = {
  url: 'https://example.com',
  title: 'Example',
  description: 'content',
};

let promise = Promise.resolve({ json: () => mockData });
const fetch = jest.fn(() => promise);
global.fetch = fetch;

beforeEach(() => {
  promise = Promise.resolve({ json: () => mockData });
  prepareBeforeEach({ app: { showWelcome: false } });
});

test('ad url is only loaded once', () => {
  const spy = jest.spyOn(Advert.prototype, 'componentDidMount');

  const app = mount(App);

  const advert = app.find('Advert');
  expect(advert.length).toBe(1);
  expect(spy).toHaveBeenCalled();

  return promise
    .then(() => {
      app.update();
    })
    .then(() => {
      const ad = advert.get(0);
      expect(ad.state.loading).toBe(false);
    });
});

test('no ad shown when user is pro', () => {
  prepareBeforeEach({ app: { showWelcome: false }, user: { pro: true } });
  const spy = jest.spyOn(Advert.prototype, 'componentDidMount');
  const app = mount(App);

  const advert = app.find('Advert').get(0);

  expect(spy).toHaveBeenCalled();
  expect(advert.state.loading).toBe(true);
});
