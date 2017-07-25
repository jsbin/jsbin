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

export const settings = {
  'editor.lineWrapping': true,
  'editor.fontSize': 13,
  'editor.autoCloseBrackets': true,
  'editor.fontFamily': `'SourceCodePro-Regular', menlo, monaco, Consolas, Lucida Console`,
  'editor.indentUnit': 2,
  'editor.indentWithTabs': false,
  'app.theme': 'light',
  'app.splitVertical': true,
};

export function parse(flattened) {
  return Object.keys(flattened).reduce((acc, curr) => {
    const [store, key] = curr.split('.');

    if (!acc[store]) acc[store] = {};
    acc[store][key] = flattened[curr];
    return acc;
  }, {});
}
