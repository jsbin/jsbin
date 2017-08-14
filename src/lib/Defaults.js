import stripJsonComments from 'strip-json-comments';
import { cmd, isMac } from './is-mac';
import { LIGHT, DARK } from '../actions/app';

export const emptyPage = `<style>
body {
	color: rgba(107,106,106,.6);
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  height: 100%;
  margin: 0;
}

p {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  margin: 0;
  font-family: Georgia, serif;
  font-size: 30px;
  box-sizing: border-box;
  line-height: 1.8;
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
}
</style>
<body><p>Your page is currently empty.<br>Change the source to instantly see changes.</p>
</body>`;

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

export const defaultUserSettings = `{
  // you can also use comments
  // "app.theme": "dark"

}`;

export const settings = `{
  // Colour scheme used in jsbin. Values can be:
  // - '${DARK}' (based on Atom One Dark)
  // - '${LIGHT}' (based on Devtools light)
  "app.theme": "${LIGHT}",

  // Switches the view from columns to rows with result at the bottom
  "app.splitColumns": true,

  // Automatically upload settings to your account (requires PRO)
  "app.syncSettings": false,

  // Default source panel. Values can be: 'html', 'css' and 'javascript'
  "app.source": "html",

  // Default result panel. Values can be: 'page', 'console', 'both' and 'none'
  "app.result": "page",
  ${'\n  ' + macSpecificKeySwap + '\n'}
  // Preferred open panel when sharing a bin URL
  "share.panel": "javascript",

  // Automatically run JavaScript in real-time. If set to "false", JavaScript
  // can be executed by using ${cmd} + enter
  "javascript.autoRun": true,

  // Font size in pixels
  "editor.fontSize": 13,

  // The font family for the editor
  "editor.fontFamily": "'SourceCodePro-Regular', menlo, monaco, Consolas, Lucida Console, monospace",

  // Whether to show line numbers to the left of the editor
  "editor.lineNumbers": true,

  // Controls line wrapping, using a soft wrap at the editor viewport
  "editor.lineWrapping": false,

  // Whether to automatically add closing bracket when you open them
  "editor.autoCloseBrackets": true,

  // Indent lines with tabs (or spaces)
  "editor.indentWithTabs": false,

  // The width of a tab
  "editor.tabSize": 2,

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
  // Examples of names defined here are Enter, F5, and Q. These can be prefixed
  // with Shift-, Cmd-, Ctrl-, and Alt- to specify a modifier. So for example,
  // Shift-Ctrl-Space would be a valid key identifier.
  // Links:
  // - keymaps: https://codemirror.net/doc/manual.html#keymaps
  // - details: https://codemirror.net/doc/manual.html#option_extraKeys
  "editor.extraKeys": {
    "Tab": "snippets",
    "Esc": "dismiss"
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
