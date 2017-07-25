import stripJsonComments from 'strip-json-comments';

export const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
</head>
<body>

</body>
</html>`;

export const css = `* {
  font-family: sans-serif;
}`;

export const javascript = `// here be your javascript`;

export const settings = `{
  // "dark" and "light" are valid themes
  "app.theme": "light",
  "app.splitVertical": true,
  "editor.fontSize": 13,
  // you can specify a font stack that suits your local fonts
  "editor.fontFamily": "'SourceCodePro-Regular', menlo, monaco, Consolas, Lucida Console",
  "editor.lineWrapping": true,
  "editor.autoCloseBrackets": true,
  "editor.indentWithTabs": false,
  "editor.indentUnit": 2,
  "editor.tabSize": 4,
  // set smartIndent to false if you're getting a mix of tabs & spaces
  "editor.smartIndent": true,
  "editor.fixedGutter": true,
  // details: https://codemirror.net/doc/manual.html#option_extraKeys
  "editor.extraKeys": null,
}`;

// expects an object similar the `settings` above
export function parse(flattened) {
  const res = JSON.parse(stripJsonComments(flattened));
  return Object.keys(res).reduce((acc, curr) => {
    const [store, key] = curr.split('.');

    if (!acc[store]) acc[store] = {};
    acc[store][key] = res[curr];
    return acc;
  }, {});
}
