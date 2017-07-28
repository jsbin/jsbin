import React from 'react';
import { push } from 'react-router-redux';
import { Command, Shift, Backspace } from '../components/Symbols';
import { RESET, SAVE, DELETE } from '../actions/bin';
import { toggleLayout, toggleTheme } from '../actions/app';
import {
  toggleOutput,
  changeOutput,
  OUTPUT_PAGE,
  OUTPUT_CONSOLE,
} from '../actions/session';
import BinToHTML from '../lib/BinToHTML';
import fetch from 'isomorphic-fetch';

import FileSaver from 'file-saver'; // @@ lazy load

export const newBin = {
  title: 'New',
  run: dispatch => {
    dispatch(push('/', { action: { type: RESET } }));
  },
};

export const save = {
  title: 'Save',
  shortcut: null,
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
    <span>
      <Command />
      <Shift />
      <Backspace />
    </span>
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
  run: () => {
    console.log('not implemented');
    // dispatch(push('/open'));
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

export const showConsole = {
  title: 'Show console',
  run: dispatch => dispatch(changeOutput(OUTPUT_CONSOLE)),
};

export const showPage = {
  title: 'Show page',
  run: dispatch => dispatch(changeOutput(OUTPUT_PAGE)),
};

export const togglePage = {
  title: 'Toggle output',
  run: dispatch => {
    dispatch(toggleOutput());
  },
};

export const bottomOutput = {
  title: 'Split horizontally',
  run: dispatch => dispatch(toggleLayout(false)),
};

export const sideOutput = {
  title: 'Split vertically',
  run: dispatch => dispatch(toggleLayout(true)),
};

export const toggleThemeCmd = {
  title: 'Toggle dark/light theme',
  run: dispatch => {
    dispatch(toggleTheme());
  },
};

export const settings = {
  title: 'Settings',
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
