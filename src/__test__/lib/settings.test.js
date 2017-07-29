/* global it */
import expect from 'expect';
import {
  merge,
  getUserSettings,
  insertChangeIntoUserSettings,
} from '../../lib/settings';
import { parse, settings as defaultSettings } from '../../lib/Defaults';

it('parses current defaults', () => {
  const parsed = parse(defaultSettings);
  expect(parsed).toBeA(Object);
  expect(parsed).toIncludeKey('app');
  expect(parsed).toIncludeKey('editor');
  expect(parsed).toIncludeKey('snippets');
  expect(parsed).toIncludeKey('share');
});

it('user settings merge process', () => {
  expect(merge).toBeA('function');

  const source = `// just a comment
  {}`;

  const user = getUserSettings(source);
  expect(user).toBeA(Object);

  const settings = merge(parse(defaultSettings), user);

  expect(settings).toBeA(Object);
  expect(settings).toIncludeKeys(['app', 'editor']);
});

it('merges new user settings without corrupting', () => {
  const source = `{
  // you can also use comments
  "app.theme": "dark"
  }`;

  const change = { 'editor.lineNumbers': true };

  const delta = insertChangeIntoUserSettings(change, source, false);
  expect(delta).toBeA('string');
  expect(delta).toInclude('//');
  const parsed = parse(delta);
  expect(parsed).toContain({ editor: { lineNumbers: true } });
});

test('merges changed user settings without corrupting', () => {
  const source = `{
  // you can also use comments
  "app.theme": "dark",
  "editor.lineNumbers": true
  }`;

  const change = { 'editor.lineNumbers': false };

  const delta = insertChangeIntoUserSettings(change, source, true);
  expect(delta).toBeA('string');
  expect(delta).toInclude('//');
  const parsed = parse(delta);
  expect(parsed).toEqual({
    app: { theme: 'dark' },
    editor: { lineNumbers: false },
  });

  const delta2 = insertChangeIntoUserSettings(change, delta, true);
  expect(delta2.split('//').length - 1).toEqual(1);
});
