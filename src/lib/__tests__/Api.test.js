/* eslint-env jest */
import * as api from '../Api';

test('getSettingsForBin', () => {
  const res = api.getSettingsForBin({
    loading: false,
    id: 'gist-fea8099798a15c86296be0082745618a',
    revision: 1,
    html:
      '# heading\n<p>\n  Yo\n  <span>0</span>\n  </p>\n  <input type="text" value="foo" autofocus>',
    javascript:
      "// here be your javascript\nvar i = 0;\n\nconst doit = () => document.querySelector('span').innerHTML = i++;\n\nsetInterval(doit, 1000)\nconsole.log(i, 'remy');\ndoit();\n\n//alert('ok');",
    css: '* {\n  font-family: sans-serif;\n  color: blue;\n}',
    updated: null,
    error: null,
    'html-processor': 'markdown',
    'css-processor': 'css',
    'javascript-processor': 'javascript',
  });
  expect(res).toEqual({
    processors: { html: 'markdown' },
  });
});

test('convertSettingsToBinProcessors', () => {
  const res = api.convertSettingsToBinProcessors({
    html: 'markdown',
  });

  expect(res).toEqual({
    'html-processor': 'markdown',
    'javascript-processor': 'javascript',
    'css-processor': 'css',
  });
});
