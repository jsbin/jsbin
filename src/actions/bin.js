import * as Api from '../lib/Api';
import * as defaults from '../lib/Defaults';
import debounce from 'lodash.debounce';

export const SET_BIN = '@@bin/set/BIN';
export const SET_JS = '@@bin/set/JS';
export const SET_HTML = '@@bin/set/HTML';
export const SET_CSS = '@@bin/set/CSS';
export const SET_RESULT = '@@bin/set/RESULT';
export const SET_ID = '@@bin/set/ID';
export const RESET = '@@bin/RESET';
export const SAVE = '@@bin/SAVE';
export const DELETE = '@@bin/DELETE';
export const ERROR = '@@bin/ERROR';
export const GET_BIN = '@@bin/fetch/GET';

export const SET_PROCESSOR = '@@bin/processor/SET';

export function setProcessor(source, target) {
  return { type: SET_PROCESSOR, source, value: target };
}

export function setBin({ id, html, css, javascript }) {
  return { type: SET_BIN, id, html, css, javascript };
}

export function setId(value) {
  return { type: SET_ID, value };
}

export function setError(value) {
  return { type: ERROR, value };
}

export function fetchNew() {
  return dispatch => {
    dispatch({ type: RESET });
    dispatch({
      type: SET_BIN,
      ...defaults,
    });
  };
}

// export function reset() {
//   return { type: RESET };
// }

export function save() {
  return { type: SAVE };
}

export function fetchLocal(id) {
  return {
    type: GET_BIN,
    promise: Api.getLocal(id),
  };
}

export function fetchGithub(id) {
  return {
    type: GET_BIN,
    promise: Api.getFromGist(id),
  };
}

export function fetchBin(id, revision = 'latest') {
  return {
    type: GET_BIN,
    promise: Api.getBin(id, revision),
  };
}

const updateResult = debounce(
  (dispatch, code) =>
    dispatch({
      type: SET_RESULT,
      code,
    }),
  500
);

export function setCode(code, type) {
  return dispatch => {
    // , getState
    // const allCode = getState().code;

    dispatch({
      type,
      code,
    });

    // combine into the result… and put in separate function
    updateResult(dispatch, code);
  };
}
