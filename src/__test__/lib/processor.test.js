/* global it */
import expect from 'expect';
import transform, { getAvailableProcessors } from '../../lib/processor';
import { HTML, JAVASCRIPT, CSS } from '../../lib/cm-modes';
import { html, css } from '../../lib/Defaults';

it('gets processors (html)', () => {
  const p = getAvailableProcessors(HTML);
  expect(p.length).toBe(2);
});

it('returns the bin without corruption', async () => {
  const javascript =
    "// here be your javascript\nconsole.log('random gist');\nconsole.log('another random')";

  const bin = {
    loading: false,
    id: 'gist-ef40da712d2fbb26f6a8c22f300fc18a',
    revision: 1,
    result:
      '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width">\n  <title>JS Bin</title>\n</head>\n<body>\n\n</body>\n</html>',
    html:
      '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width">\n  <title>JS Bin</title>\n</head>\n<body>\n\n</body>\n</html>',
    javascript,
    css: '* {\n  font-family: sans-serif;\n}',
    updated: '2017-08-16T08:49:53.636Z',
    error: null,
    'html-processor': 'html',
    'css-processor': 'css',
    'javascript-processor': 'javascript',
    settings: null,
  };
  const res = await transform(bin, 'html');

  expect(res.javascript).toInclude(javascript);
});
