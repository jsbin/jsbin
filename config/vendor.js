window.ReactDOM = require('react-dom');
window.React = require('react');
window.CodeMirror = require('codemirror');

require('codemirror/keymap/vim');
require('codemirror/keymap/sublime');
require('codemirror/keymap/emacs');

// require('codemirror/addon/lint/lint');
// require('codemirror/addon/lint/javascript-lint');

require('codemirror/addon/edit/closetag');
require('codemirror/addon/fold/xml-fold');
require('codemirror/addon/edit/closebrackets');

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/jsx/jsx');
require('codemirror/mode/css/css');
require('codemirror/mode/xml/xml');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/addon/display/autorefresh');
