import React from 'react';
import slugger from 'jsbin-id';
import binToHTML from 'bin-to-file';
import idk from 'idb-keyval';
import { replace } from 'react-router-redux';
import { SAVE, setId, setSha } from '../../actions/bin';
import { convertToStandardBin, GH_API } from '../Api';
import { addNotification } from '../../actions/notifications';

const ORIGIN = process.env.REACT_APP_ORIGIN || window.location.origin;

function encodeForGithub(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(
      match,
      p1
    ) {
      return String.fromCharCode('0x' + p1);
    })
  );
}

export const saveToGithub = {
  title: 'Save to GitHub',
  meta: 'publish git github',
  shortcut: 'command+shift+s',
  condition: ({ user, bin }) => !!user.githubToken,
  run: async (dispatch, { bin, user, processors, app }) => {
    const standardBin = convertToStandardBin({ bin, processors });
    const id = bin.id || slugger();
    const owner = user.githubUsername || user.username;
    const repo = 'bins';
    const message = '🏗 jsbin release';

    const result = binToHTML(standardBin);

    // const url = `https://jsbin.me/${owner}:${id}`;
    const defaultBase = `https://${owner}.github.io/${repo}`;
    const url = `${app.baseUrl || defaultBase}/${id}/`;

    const content = encodeForGithub(result);

    idk.set(`${owner}:${id}`, bin);

    fetch(`${GH_API}/repos/${owner}/${repo}/contents/${id}/index.html`, {
      method: 'put',
      body: JSON.stringify({
        sha: bin.sha,
        message,
        content,
        owner,
      }),
      mode: 'cors',
      headers: {
        Authorization: `token ${user.githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }).then(res => {
      // FIXME capture sha and update locally
      if (res.status < 300) {
        if (!bin.id) {
          // assume we need to dispatch the change
          dispatch(replace(`/${owner}:${id}/edit${window.location.search}`));
          dispatch(setId(id));
        }
        res.json().then(json => dispatch(setSha(json.content.sha)));
        dispatch(
          addNotification(
            <span>
              Created:{' '}
              <a target="_blank" href={url}>
                {url}
              </a>
            </span>
          )
        );
      } else {
        res.json().then(res => {
          console.error(res);
        });
      }
    });
  },
};

export const save = {
  title: 'Save offline',
  meta: 'local locally',
  shortcut: 'command+s',
  run: dispatch => {
    dispatch({ type: SAVE });
  },
};

export const publish = {
  title: 'Save to JS Bin',
  condition: ({ user }) => !!user.username,
  run: async (dispatch, { bin, user }) => {
    const exporter = await import(/* webpackChunkName: "exporter" */ '../../lib/exporter');
    const { id } = await exporter.jsbin(bin, user);

    const url = `${ORIGIN}/${id}`;

    // if created…
    dispatch(
      addNotification(
        <span>
          Created:{' '}
          <a target="_blank" href={url}>
            {url}
          </a>
        </span>
      )
    );
    dispatch(replace(`/${id}`));
  },
};
