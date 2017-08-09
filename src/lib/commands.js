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
import summary from './summary';

import FileSaver from 'file-saver'; // @@ lazy load
import { getAvailableProcessors } from '../lib/processor';

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

    return Promise.all(
      keys.map(key => {
        return idk.get(key).then(res => {
          let content = summary(res);

          if (!content) {
            content = key;
          }

          if (content.length > 100) {
            content = content.substr(0, 99) + '…';
          }

          return {
            title: content,
            updated: res.updated,
            run: dispatch => {
              dispatch(push('/local/' + key));
            },
          };
        });
      })
    ).then(bins => {
      return bins.sort((a, b) => {
        if (!a.updated) return 1;
        return a.updated < b.updated ? 1 : -1;
      });
    });
  },
};

export const addLibrary = {
  title: 'Add library…',
  run: async () => {
    const json = await import(/* webpackChunkName: "libraries" */ '../lib/libraries.json');

    const run = url => {
      if (!Array.isArray(url)) {
        url = [url];
      }

      return url.map(url => `<script src="${url}"></script>`).join('\n');
    };

    const results = [];
    json.results.forEach(
      ({ assets, version, name, keywords = null, latest }) => {
        if (!keywords) keywords = [];

        results.push({
          title: name,
          name,
          display: `${name} @ ${version}`,
          meta: `${name} ${keywords.join(' ')}`,
          run: run.bind(null, latest),
        });

        if (assets && assets[0].files.length > 1) {
          const files = assets[0].files;
          results.push({
            title: name,
            name,
            display: `${name} (plus ${files.length -
              1} extra assets) @ ${version}`,
            meta: `${name} ${keywords.join(' ')}`,
            run: run.bind(
              null,
              files.map(file => {
                return `https://cdnjs.cloudflare.com/ajax/libs/${name}/${version}/${file}`;
              })
            ),
          });
        }
      }
    );
    return results.sort(
      (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
    );
  },
};

export const changeLanguage = {
  title: 'Change language',
  condition: ({ app }) => processors[app.source].length > 1,
  run: (dispatch, { app }) => {
    return [
      ...processors[app.source].map(config => ({
        title: config.label,
        run: dispatch => dispatch(setProcessor(app.source, config.name)),
      })),
    ];
  },
};

export const exportToCodePen = {
  title: 'Export to CodePen',
  run: async (dispatch, { bin, user }) => {
    if (!user.pro) {
      return {
        title: 'JS Bin license required, upgrade?',
        run: dispatch => {
          dispatch(push('/upgrade'));
        },
      };
    }

    const exporter = await import(/* webpackChunkName: "exporter" */ '../lib/exporter');

    exporter.codepen(bin);
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
