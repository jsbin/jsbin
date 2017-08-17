import React from 'react';
import copy from 'copy-to-clipboard';
import { push, replace } from 'react-router-redux';
import distanceInWords from 'date-fns/distance_in_words';
import { getBins } from './Api';
import { addNotification } from '../actions/notifications';
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
  run: (dispatch, { bin, processors }) => {
    const html = BinToHTML({
      html: processors['html-result'],
      javascript: processors['javascript-result'],
      css: processors['css-result'],
    });

    const blob = new Blob([html], { type: 'text/html' });
    FileSaver.saveAs(blob, (bin.id || 'jsbin') + '.html');
  },
};

const copyOk = dispatch =>
  dispatch(addNotification('Copied 👍', { dismissAfter: 5 * 1000 }));

export const copyToClip = {
  title: 'Copy to clipboard',
  run: (dispatch, { bin, app }) => {
    copy(bin[app.source]);
    copyOk(dispatch);
  },
};

export const copyTransformed = {
  title: 'Copy compiled to clipboard',
  condition: ({ bin, app }) => {
    return bin[app.source + '-processor'] !== app.source;
  },
  run: (dispatch, { bin, app, processors }) => {
    copy(processors[app.source + '-result']);
    copyOk(dispatch);
  },
};

export const copyAll = {
  title: 'Copy page result to clipboard',
  run: (dispatch, { processors }) => {
    const html = BinToHTML({
      html: processors['html-result'],
      javascript: processors['javascript-result'],
      css: processors['css-result'],
    });
    copy(html);
    copyOk(dispatch);
  },
};

export const del = {
  title: 'Delete',
  shortcut: (
    <kbd>
      <Command /> <Shift /> <Backspace />
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
  run: async (dispatch, { user }) => {
    const keys = await idk.keys();
    if (keys.length === 0) {
      return [
        {
          title: `…you don't have any locally saved bins`,
        },
      ];
    }

    const now = Date.now();

    const remoteBins = getBins(user).then(bins => {
      if (!Array.isArray(bins)) {
        return [];
      }

      return bins.map(bin => {
        let content = bin.summary;
        if (content.length > 100) {
          content = content.substr(0, 99) + '…';
        }

        const display = (
          <span>
            <span
              className="brick"
              style={{
                backgroundColor: `#${bin.id.toString().slice(-6)}`,
              }}
            />
            {content}
            <span className="updated">
              {' '}{distanceInWords(now, bin.date, { addSuffix: true })}
            </span>
          </span>
        );

        return {
          title: bin.title,
          updated: bin.date,
          display,
          run: dispatch => dispatch(push(`/${bin.url}/${bin.revision}`)),
        };
      });
    });

    return Promise.all([
      remoteBins,
      ...keys.map(key => {
        return idk.get(key).then(res => {
          let content = summary(res);

          if (!content) {
            content = key;
          }

          if (content.length > 100) {
            content = content.substr(0, 99) + '…';
          }

          const hex = (res.id || '').split('-').pop();

          const display = (
            <span>
              {hex.length === 3 &&
                <span
                  className="brick"
                  style={{ backgroundColor: `#${hex}` }}
                />}
              {content}
              {res.updated &&
                <span className="updated">
                  {' '}{distanceInWords(now, res.updated, { addSuffix: true })}
                </span>}
            </span>
          );

          return {
            title: content,
            updated: res.updated ? res.updated.toJSON() : null,
            display,
            run: dispatch => dispatch(push('/local/' + key)),
          };
        });
      }),
    ])
      .then(([remote, ...bins]) => {
        return remote.concat(bins).sort((a, b) => {
          if (!a.updated) return 1;
          return a.updated < b.updated ? 1 : -1;
        });
      })
      .catch(e => {
        console.log(e);
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
    json.forEach(
      ({ assets = [], version, name, keywords = null, filename }) => {
        if (!keywords) keywords = [];

        const latest = `https://cdnjs.cloudflare.com/ajax/libs/${name}/${version}/${filename}`;

        results.push({
          title: name,
          name,
          display: `${name} @ ${version}`,
          meta: `${name} ${keywords.join(' ')}`,
          run: run.bind(null, latest),
        });

        if (assets.length) {
          results.push({
            title: name,
            name,
            display: `${name} (plus ${assets.length -
              1} extra assets) @ ${version}`,
            meta: `${name} ${keywords.join(' ')}`,
            run: run.bind(
              null,
              assets.map(file => {
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

export const exportToGist = {
  title: 'Export to Gist',
  run: async (dispatch, { bin, user }) => {
    const exporter = await import(/* webpackChunkName: "exporter" */ '../lib/exporter');
    const id = await exporter.gist(bin, user);
    dispatch(
      addNotification(
        <span>
          <a target="_blank" href={`https://gist.github.com/${id}`}>
            Gist successfully created
          </a>
        </span>
      )
    );
    dispatch(replace(`/gist/${id}`));
  },
};

export const exportToCodePen = {
  title: 'Export to CodePen',
  run: async (dispatch, { bin, user }) => {
    // if (!user.pro) {
    //   return {
    //     title: 'JS Bin license required, upgrade?',
    //     run: dispatch => {
    //       dispatch(push('/upgrade'));
    //     },
    //   };
    // }

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
      <Command /> <Shift />
      {' ,'}
    </kbd>
  ),
  run: () => {
    // dispatch => dispatch(push('/settings')),
    window.open('/settings');
    return null;
  },
};

export const account = {
  title: 'Account',
  condition: ({ user }) => !!user.username,
  run: dispatch => {
    dispatch(push('/account'));
  },
};

export const login = {
  title: 'Login',
  condition: ({ user }) => user.username === 'anonymous',
  run: () => {
    window.location = `${process.env.REACT_APP_API}/auth`;
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
