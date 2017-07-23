import * as Api from '../lib/Api';
import * as defaults from '../lib/Defaults';

export const SET_BIN = '@@bin/set/BIN';
export const SET_JS = '@@bin/set/JS';
export const SET_HTML = '@@bin/set/HTML';
export const SET_CSS = '@@bin/set/CSS';
export const SET_OUTPUT = '@@bin/set/OUTPUT';
export const RESET = '@@bin/RESET';
export const GET_BIN = '@@bin/fetch/GET';

export function fetchDefault() {
  return {
    type: SET_BIN,
    ...defaults,
  };
}

export function fetchBin(id, revision = 'latest') {
  return {
    type: GET_BIN,
    promise: Api.getBin(id, revision),
  };
}

export function setCode(type, code) {
  return dispatch => {
    // , getState
    // const allCode = getState().code;

    dispatch({
      type,
      code,
    });

    // combine into the output… and put in separate function
    return new Promise(resolve => {
      const output = code;
      resolve(
        dispatch({
          type: SET_OUTPUT,
          code: output,
        })
      );
    });
  };
}
