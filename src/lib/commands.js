import React from 'react';
import { push } from 'react-router-redux';
import { Command, Shift, Backspace } from '../components/Symbols';
import { RESET, SAVE, DELETE, setProcessor } from '../actions/bin';
import { toggleLayout, toggleTheme } from '../actions/app';
import {
  toggleResult,
  changeResult,
  RESULT_PAGE,
  RESULT_CONSOLE,
} from '../actions/session';
import BinToHTML from '../lib/BinToHTML';
import idk from 'idb-keyval';
import { JAVASCRIPT, CSS, HTML } from '../lib/cm-modes';

import FileSaver from 'file-saver'; // @@ lazy load
import { getAvailableProcessors, NONE } from '../lib/processor';

const processors = {
  [JAVASCRIPT]: getAvailableProcessors(JAVASCRIPT),
  [CSS]: getAvailableProcessors(CSS),
  [HTML]: getAvailableProcessors(HTML),
};

export const newBin = {
  title: 'New',
  run: dispatch => {
    dispatch(push('/', { action: { type: RESET } }));
  },
};

export const save = {
  title: 'Save',
  shortcut: (
    <kbd>
      <Command /> S
    </kbd>
  ),
  run: dispatch => {
    dispatch({ type: SAVE });
  },
};

export const download = {
  title: 'Download',
  run: (dispatch, { bin }) => {
    const blob = new Blob([BinToHTML(bin)], { type: 'text/html' });
    FileSaver.saveAs(blob, (bin.id || 'jsbin') + '.html');
  },
};

export const del = {
  title: 'Delete',
  shortcut: (
    <kbd>
      <Command />
      <Shift />
      <Backspace />
    </kbd>
  ),
  run: dispatch => {
    if (
      window.confirm('Are you sure you want to permanently delete this bin?')
    ) {
      dispatch({ type: DELETE });
    }
  },
};

export const open = {
  title: 'Open...',
  run: async () => {
    const keys = await idk.keys();
    if (keys.length === 0) {
      return [
        {
          title: `...you don't have any locally saved bins`,
        },
      ];
    }

    return keys.map(key => ({
      title: key,
      run: dispatch => {
        dispatch(push('/local/' + key));
      },
    }));
  },
};

export const addLibrary = {
  title: 'Add library…',
  run: async () => {
    const res = await fetch(
      'https://api.cdnjs.com/libraries?fields=name,filename,version,keywords'
    );
    const json = await res.json();

    const run = url => {
      if (url.endsWith('.css')) {
        return `<link rel="stylesheet" href="${url}" />`;
      }

      if (url.endsWith('.js')) {
        return `<script src="${url}"></script>`;
      }

      return url;
    };

    return json.results
      .map(({ name, version, keywords, latest }) => ({
        title: name,
        display: `${name} @ ${version}`,
        meta: name + ' ' + keywords.join(' '),
        run: run.bind(null, latest),
      }))
      .sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1));
  },
};

export const changeLanguage = {
  title: 'Change language',
  condition: ({ app }) => processors[app.source].length > 0,
  run: (dispatch, { app }) => {
    return [
      {
        title: app.source, // FIXME need correct label
        run: dispatch => dispatch(setProcessor(app.source, NONE)),
      },
      ...processors[app.source].map(({ config }) => ({
        title: config.name,
        run: dispatch => dispatch(setProcessor(app.source, config.name)),
      })),
    ];
  },
};

export const showConsole = {
  title: 'Show console',
  run: dispatch => dispatch(changeResult(RESULT_CONSOLE)),
};

export const showPage = {
  title: 'Show page',
  run: dispatch => dispatch(changeResult(RESULT_PAGE)),
};

export const togglePage = {
  title: 'Toggle result',
  run: dispatch => {
    dispatch(toggleResult());
  },
};

export const splitRight = {
  condition: ({ app }) => !app.splitColumns,
  title: 'Split to the right',
  run: dispatch => dispatch(toggleLayout(true)),
};

export const splitBottom = {
  condition: ({ app }) => app.splitColumns,
  title: 'Split to the bottom',
  run: dispatch => dispatch(toggleLayout(false)),
};

export const toggleThemeCmd = {
  title: 'Toggle dark/light theme',
  run: dispatch => {
    dispatch(toggleTheme());
  },
};

export const welcome = {
  title: 'Help: Welcome',
  run: dispatch => dispatch(push('/welcome')),
};

export const settings = {
  title: 'Settings',
  shortcut: (
    <kbd>
      <Command />
      <Shift />
      {' ,'}
    </kbd>
  ),
  run: () => {
    // dispatch => dispatch(push('/settings')),
    window.open('/settings');
    return null;
  },
};

/**
 * Wanted commands:
 *
 * save as template (optionally named)
 * new from template
 * upgrade
 * clone
 * export
 * delete
 * make private
 * help / search
 */
