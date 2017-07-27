import fetch from 'isomorphic-fetch';

const API = process.env.REACT_APP_API;

const settings = ({ opts, token } = {}) => {
  const headers = {
    // 'content-type': 'application/json'
  };
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return {
    mode: 'cors',
    headers,
    ...opts,
  };
};

export const getBin = (id, revision = 'latest') => {
  return fetch(`${API}/bin/${id}/${revision}`, settings()).then(res =>
    res.json()
  );
};

export const getFromGist = async id => {
  const res = await fetch(`https://api.github.com/gists/${id}`, {
    mode: 'cors',
  });
  const { files } = await res.json();
  const settings = getFileFromGist({ type: 'json', files, parse: true });

  if (settings && settings.html) {
    const { html = '', javascript = '', css = '' } = settings;

    return {
      html,
      javascript,
      css,
      id: 'gist-' + id,
      settings: settings.settings || {},
    };
  }

  // otherwise look for the files
  const html = getFileFromGist({ type: 'html', files }) || '';
  const css = getFileFromGist({ type: 'css', files }) || '';
  const javascript = getFileFromGist({ type: 'js', files }) || '';

  return { html, javascript, css, id: 'gist-' + id, settings };
};

function getFileFromGist({ type, files, parse = false } = {}) {
  const file = Object.keys(files).find(file => file.endsWith('.' + type));

  if (!files[file]) {
    return null;
  }

  const content = files[file].content;

  return parse ? JSON.parse(content) : content;
}
