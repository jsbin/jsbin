import idk from 'idb-keyval'; // FIXME lazy load candidate
import * as ALL_MODES from './cm-modes';
const MODES = [ALL_MODES.HTML, ALL_MODES.CSS, ALL_MODES.JAVASCRIPT];
const API = process.env.REACT_APP_API;
const POST_API = process.env.REACT_APP_POST_API;

// converts *-processor into the bin.settings object compatible with production
export const getSettingsForBin = bin => {
  const processors = MODES.reduce((acc, curr) => {
    const value = bin[`${curr}-processor`];
    if (value !== curr) {
      acc[curr] = value;
    }
    return acc;
  }, {});

  return { processors };
};

export const convertToStandardBin = ({ bin, processors }) => {
  const settings = getSettingsForBin(bin);
  const res = {
    html: processors['html-result'],
    javascript: processors['javascript-result'].code,
    css: processors['css-result'],
    ...settings,
  };

  const source = MODES.reduce((acc, curr) => {
    if (res[curr] !== bin[curr]) {
      acc[curr] = bin[curr];
    }
    return acc;
  }, {});

  if (Object.keys(source).length) {
    res.source = source;
  }

  return res;
};

export const convertSettingsToBinProcessors = settings => {
  if (!settings) {
    return { processors: {} };
  }

  const res = settings.processors || settings; // this is dodgy…
  return MODES.reduce((acc, mode) => {
    acc[`${mode}-processor`] = res[mode] || mode;
    return acc;
  }, {});
};

const settings = ({ token, ...opts } = {}) => {
  const headers = opts.headers || {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    mode: 'cors',
    headers,
    ...opts,
  };
};

export const refreshToken = ({ token }) => {
  return fetch(`${API}/auth/refresh`, settings({ token })).then(res =>
    res.json()
  );
};

export const getBins = ({ token }) => {
  return fetch(`${API}/user/bins`, settings({ token })).then(res => res.json());
};

export const createBin = (bin, { token }) => {
  return fetch(
    `${API}/bin`,
    settings({
      token,
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(bin),
    })
  ).then(res => res.json());
};

export const getInvoice = (id, { token }) => {
  return fetch(`${API}/user/invoice/${id}`, settings({ token })).then(res =>
    res.json()
  );
};

export const getInvoices = ({ token }) => {
  return fetch(`${API}/user/invoice/`, settings({ token })).then(res =>
    res.json()
  );
};

export const getBin = (id, revision = 'latest') => {
  return fetch(`${API}/bin/${id}/${revision}`, settings()).then(res => {
    if (res.status !== 200) {
      // this is a bit sucky, but redux-pack expect an object not a first class
      // error to be rejected
      console.log('failed to fetch from bin api - check network panel');
      return Promise.reject({ status: res.status });
    }

    return res.json();
  });
};

export const getFromPost = async id => {
  const res = await fetch(`${POST_API}/${id}.raw`, { mode: 'cors' });
  if (res.status !== 200) {
    const error = new Error(
      'The content for this bin is missing, if you head back and re-submit, it should load.'
    );
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  const { html, javascript, css, settings } = data;

  return { html, javascript, css, settings };
};

export const getLocal = async id => {
  return idk.get(id).then(res => {
    if (res === undefined) {
      return Promise.reject({
        status: 404,
        message: `That local bin doesn't exist. If you expected it to, it's possible you're using a different browser, or incognito and ultimately doesn't have access to your browser's local store of bins.`,
      });
    }
    return { ...res, id };
  });
};

export const getFromGist = async id => {
  const res = await fetch(`https://api.github.com/gists/${id}`, {
    mode: 'cors',
  });

  if (res.status !== 200) {
    const error = new Error(
      `Github doesn't think that gist exists. Maybe double check the original gist URL, and swap out the gist.github.com bit for jsbin.com.`
    );
    error.status = res.status;
    throw error;
  }

  const { files } = await res.json();
  const settings = getFileFromGist({ type: 'json', files, parse: true });

  if (!files['jsbin-settings.json'] && settings && settings.html) {
    const { html = '', javascript = '', css = '' } = settings;

    return {
      html,
      javascript,
      css,
      // id: 'gist-' + id, // note: adding an ID means the bin will immediately save on change
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
