import * as Api from '../lib/Api';
import { html, javascript, css } from '../lib/Defaults';
import * as MODES from '../lib/cm-modes';
import debounce from 'lodash.debounce';
import { process, asHTML } from '../lib/processor';
import { clearError, setError as codeError } from './session';

import { SET_RESULT as SET_PROCESSOR_RESULT } from './processors';

export const SET_BIN = '@@bin/set/BIN';
export const SET_JS = '@@bin/set/JS';
export const SET_HTML = '@@bin/set/HTML';
export const SET_CSS = '@@bin/set/CSS';
export const SET_ID = '@@bin/set/ID';
export const RESET = '@@bin/RESET';
export const SAVE = '@@bin/SAVE';
export const DELETE = '@@bin/DELETE';
export const ERROR = '@@bin/ERROR';
export const SET_PROCESSOR = '@@bin/processor/SET';

export const FETCH_BIN_REQUEST = '@@bin/fetch/BIN_REQUEST';
export const FETCH_BIN_SUCCESS = '@@bin/fetch/BIN_SUCCESS';
export const FETCH_BIN_FAILURE = '@@bin/fetch/BIN_FAILURE';

export function setProcessor(source, target) {
  return { type: SET_PROCESSOR, source, value: target };
}

export function setId(value) {
  return { type: SET_ID, value };
}

export function setError(value) {
  return { type: ERROR, value };
}

export function reset() {
  return { type: RESET };
}

export function save() {
  return { type: SAVE };
}

export function fetchNew() {
  return fetchSequence(Promise.resolve({ html, javascript, css }));
}

export function fetchLocal(id) {
  return fetchSequence(Api.getLocal(id));
}

export function fetchGithub(id) {
  return fetchSequence(Api.getFromGist(id));
}

export function fetchPost(id) {
  return fetchSequence(Api.getFromPost(id));
}

export function fetchBin(id, revision = 'latest') {
  return fetchSequence(Api.getBin(id, revision));
}

function fetchSequence(promise) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_BIN_REQUEST });

    promise.then(
      bin => {
        if (!bin.settings) {
          bin.settings = { processors: {} };
        }
        const settings = { ...bin.settings.processors };
        const reducedBin = { ...bin };
        delete reducedBin.settings;
        Object.values(MODES).forEach(mode => {
          reducedBin[`${mode}-processor`] = settings[mode] || mode;
        });

        dispatch({ type: SET_BIN, payload: reducedBin });
        dispatch({ type: FETCH_BIN_SUCCESS });
        updateResult(dispatch, getState);
      },
      value => dispatch({ type: FETCH_BIN_FAILURE, value })
    );
  };
}

/**
 * Set the code for a particular panel (HTML, CSS or JS)
 * @param {String} code - user code
 * @param {String} type - bin action type, must be SET_HTML, SET_CSS or SET_JS
 */
export function setCode(code, type) {
  return (dispatch, getState) => {
    dispatch({
      type,
      code,
    });

    // combine into the result… and put in separate function
    updateResult(dispatch, getState, type);
  };
}

export function triggerUpdate() {
  return (dispatch, getState) => updateResult(dispatch, getState);
}

const updateResult = debounce(async (dispatch, getState, type = SET_BIN) => {
  const { bin } = getState();
  let source = null;
  if (type === SET_HTML) {
    source = MODES.HTML;
  }
  if (type === SET_JS) {
    source = MODES.JAVASCRIPT;
  }
  if (type === SET_CSS) {
    source = MODES.CSS;
  }

  let promise;

  const then = type => res => {
    dispatch({
      type: `@@processor/set/${type.toUpperCase()}`, // this feels…shoddy.
      value: res,
    });
  };

  if (source) {
    promise = [
      process(bin[source], source, bin[`${source}-processor`]).then(
        then(source)
      ),
    ];
  } else {
    promise = Object.keys(MODES).map(key => {
      const source = MODES[key];
      return process(bin[source], source, bin[`${source}-processor`]).then(
        then(source)
      );
    });
  }

  try {
    dispatch(clearError());
    await Promise.all(promise);
  } catch (e) {
    dispatch(codeError(e.detail));
    return;
  }

  const { processors } = getState();
  const toRender = {
    [MODES.HTML]: processors[`${MODES.HTML}-result`],
    [MODES.CSS]: processors[`${MODES.CSS}-result`],
    [MODES.JAVASCRIPT]: processors[`${MODES.JAVASCRIPT}-result`],
  };

  const length = Object.keys(toRender).filter(key => toRender[key] !== null)
    .length;

  if (length === 3) {
    const { result, insertJS } = asHTML(toRender);
    dispatch({ type: SET_PROCESSOR_RESULT, result, insertJS });
  } else {
    const missing = Object.keys(toRender)
      .filter(key => toRender[key] === null)
      .join(', ');
    console.log('%cnot ready yet (%s missing)', 'font-weight: bold', missing);
  }
}, 500);
