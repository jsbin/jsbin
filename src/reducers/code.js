import { SET_HTML, SET_JS, SET_CSS, SET_OUTPUT } from '../actions/code';

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
</head>
<body>

</body>
</html>`;

const defaultState = {
  output: '',
  html,
  js: '',
  css: ''
};

export default function reducer(state = defaultState, action) {
  const { type, code } = action;

  if (type === SET_OUTPUT) {
    return { ...state, output: code };
  }

  if (type === SET_HTML) {
    return { ...state, html: code };
  }

  if (type === SET_CSS) {
    return { ...state, css: code };
  }

  if (type === SET_JS) {
    return { ...state, js: code };
  }

  return state;
}
