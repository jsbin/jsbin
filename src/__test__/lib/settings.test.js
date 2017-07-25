/* global it */
import expect from 'expect';
import { merge, getUserSettings } from '../../lib/settings';
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
  const settings = merge(user, getUserSettings(defaultSettings));

  expect(settings).toBeA(Object);
  expect(settings).toIncludeKeys(['app', 'editor']);
});
