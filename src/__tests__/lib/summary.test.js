/* global it */
import expect from 'expect';
import summary from '../../lib/summary';
import * as defaults from '../../lib/Defaults';

it('extracts from the <body> tag', () => {
  const p = '<p>This is the real content.</p>\n<img src="foo.png">';
  const bin = {
    html: defaults.html.replace('<body>', '<body>' + p),
  };
  const res = summary(bin);
  expect(res).toBe(p.replace(/\n/, ' '));
});

it('extracts from markdown from bin', () => {
  const p = '# Title\n\nThis is the body';
  const bin = {
    html: p,
    javascript: '// this is the JS',
  };
  const res = summary(bin);
  expect(res).toBe(p.replace(/\n/g, ' '));
});
