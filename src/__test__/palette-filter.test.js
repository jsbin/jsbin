/* global test, expect */

import { filter } from '../components/Palette';
const libraries = require('./fixtures/libraries.json').result.map(
  ({ name }) => ({ title: name })
);

test('Filter weights towards longer words', () => {
  const res = filter('jquery', libraries);
  expect(res.length);
});
