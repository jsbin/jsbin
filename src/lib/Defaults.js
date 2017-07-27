import stripJsonComments from 'strip-json-comments';
import { cmd, isMac } from './is-mac';

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

export const javascript = `// here be your javascript
`;

const macSpecificKeySwap = isMac
  ? `// Use control key instead of command for shortcuts
  "app.useControl": false,`
  : '';

export const settings = `{
  // Colour scheme used in jsbin. Values can be:
  // - 'dark' (based on Atom One Dark)
  // - 'light' (based on Devtools light)
  "app.theme": "light",

  // Switches the view from columns to rows with output at the bottom
  "app.splitVertical": true,

  // Automatically upload settings to your account (requires PRO)
  "app.syncSettings": false,

  // Default source panel. Values can be: 'html', 'css' and 'javascript'
  "app.source": "html",

  // Default output panel. Values can be: 'page', 'console', 'both' and 'none'
  "app.output": "page",
  ${'\n' + macSpecificKeySwap + '\n'}
  // Preferred open panel when sharing a bin URL
  "share.panel": "javascript",

  // Automatically run JavaScript in real-time. If set to "false", JavaScript
  // can be executed by using ${cmd} + enter
  "javascript.autoRun": true,

  // Font size in pixels
  "editor.fontSize": 13,

  // The font family for the editor
  "editor.fontFamily": "'SourceCodePro-Regular', menlo, monaco, Consolas, Lucida Console",

  // Whether to show line numbers to the left of the editor
  "editor.lineNumbers": false,

  // Controls line wrapping, using a soft wrap at the editor viewport
  "editor.lineWrapping": false,

  // Whether to automatically add closing bracket when you open them
  "editor.autoCloseBrackets": true,

  // Indent lines with tabs (or spaces)
  "editor.indentWithTabs": false,

  // The width of a tab character
  "editor.tabSize": 4,

  // How many spaces a block should be indented.
  "editor.indentUnit": 2,

  // Whether to use the context-sensitive indentation that the mode provides
  // (or just indent the same as the line before). If you find the editor
  // is mixing tabs and spaces, set this to 'false'
  "editor.smartIndent": true,

  // Determines whether the gutter scrolls along with the content horizontally
  // (false) or whether it stays fixed during horizontal scrolling
  "editor.fixedGutter": true,

  // Configures the key map to use. Values can be:
  // - 'default' (standard CodeMirror keybindings)
  // - 'sublime' (based on sublime, includes ${cmd}+d for multiple cursors)
  // - 'vim'
  // - 'emacs'
  "editor.keyMap": "default",

  // Configure custom key handling in CodeMirror to trigger commands. The
  // 'snippets' command will use your custom snippets defined using
  // 'snippets.javascript' etc.
  // details: https://codemirror.net/doc/manual.html#option_extraKeys
  "editor.extraKeys": {
    "Tab": "snippets"
  },

  // Custom snippets that expand on tab press. Use $0 for the position
  // to insert the cursor after the snippet is inserted.
  "snippets.javascript": {
    "cl": "console.log($0);"
  },

  "snippets.css": {},

  "snippets.html": {}
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
