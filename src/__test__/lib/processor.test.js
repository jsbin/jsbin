/* global it */
import expect from 'expect';
import { getAvailableProcessors } from '../../lib/processor';
import { HTML, JAVASCRIPT, CSS } from '../../lib/cm-modes';

it.only('gets processors (html)', () => {
  const p = getAvailableProcessors(HTML);
  expect(p.length).toBe(2);
});
