import fetch from 'isomorphic-fetch';

export const FETCH_BIN = 'FETCH_BIN';
export const FETCH_BIN_SUCCESS = 'FETCH_BIN_SUCCESS';
export const FETCH_BIN_FAILURE = 'FETCH_BIN_FAILURE';

export const SET_JS = 'SET_JS';
export const SET_HTML = 'SET_HTML';
export const SET_CSS = 'SET_CSS';
export const SET_OUTPUT = 'SET_OUTPUT';

const API = process.env.REACT_APP_API;

export function setCode(type, code) {
  return async (dispatch, getState) => {
    const allCode = getState().code;

    dispatch({
      type,
      code
    });

    // combine into the output…
    return new Promise(resolve => {
      const output = code;
      resolve(
        dispatch({
          type: SET_OUTPUT,
          code: output
        })
      );
    });
  };
}

export function fetchCourse(id, token) {
  const payload = fetch(`${API}/bin/${id}/latest`, {
    mode: 'cors',
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  return {
    type: FETCH_BIN,
    payload
  };
}

export function fetchCourseSuccess(payload) {
  return {
    type: FETCH_BIN_SUCCESS,
    payload
  };
}

export function fetchCourseFailure(error) {
  return {
    type: FETCH_BIN_FAILURE,
    payload: error
  };
}
