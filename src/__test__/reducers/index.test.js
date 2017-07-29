/* global test */
import expect from 'expect';
import { SET_OPTION } from '../../actions/editor';
import reducers from '../../reducers';
import stripComments from 'strip-json-comments';

test('layout change multiple times to the same value does not corrupt', () => {
  const action = {
    type: '@@app/TOGGLE_LAYOUT',
    value: false,
  };

  const store = {
    app: {
      theme: 'light',
      splitVertical: true,
      syncSettings: false,
      source: 'html',
      output: 'page',
      useControl: false,
      vertical: false,
    },
    user: {
      settings: `{
      // you can also use comments
      "editor.lineNumbers": true,
      "editor.lineWrapping": true,
      "editor.tabSize": 2,
      "editor.smartIndent": true,
      "editor.extraKeys": {
        "Tab": "snippets",
        "Cmd-S": "autoFormat"
      },
      "app.vertical": true,
      "app.source": "html",
      "editor.fontSize": 15,
      "app.theme": "light",
      "editor.keyMap": "sublime",
      "snippets.html": {
        "test": "@local/f73521ad-34be-4353-be1d-127172393391"
      }
    }`,
    },
  };

  const res = reducers(store, action);
  const res2 = reducers(res, action);
  expect(
    (res2.user.settings.match(/f73521ad-34be-4353-be1d-127172393391/g) || [])
      .length
  ).toEqual(1);
  expect(() => JSON.parse(stripComments(res2.user.settings))).toNotThrow(/.*/);
});

test('start state', () => {
  let store = {};
  store = reducers(store, {
    type: SET_OPTION,
    option: 'lineNumbers',
    value: true,
  });
  expect(store.user.settings).toInclude('"editor.lineNumbers": true');

  store = reducers(store, {
    type: SET_OPTION,
    option: 'lineWrapping',
    value: true,
  });

  expect(JSON.parse(stripComments(store.user.settings))).toContain({
    'editor.lineNumbers': true,
    'editor.lineWrapping': true,
  });
});

test('lineNumbers change trickles up to user settings', () => {
  const store = {
    editor: { lineNumbers: true, lineWrapping: false },
    user: {
      settings: `{
      // you can also use comments
      "editor.lineNumbers": true,
      "editor.lineWrapping": true,
      "editor.tabSize": 2,
      "editor.smartIndent": true,
      "editor.extraKeys": {
        "Tab": "snippets",
        "Cmd-S": "autoFormat"
      },
      "app.vertical": true,
      "app.source": "html",
      "editor.fontSize": 15,
      "app.theme": "light",
      "editor.keyMap": "sublime",
      "snippets.html": {
        "test": "@local/f73521ad-34be-4353-be1d-127172393391"
      }
    }`,
    },
  };

  const res = reducers(store, {
    type: SET_OPTION,
    option: 'lineNumbers',
    value: false,
  });

  expect(res.editor).toEqual({
    lineNumbers: false,
    lineWrapping: false,
  });

  expect(JSON.parse(stripComments(res.user.settings))).toInclude({
    lineNumbers: false,
  });
});
