import { handle } from 'redux-pack';

import {
  SET_HTML,
  ERROR,
  SET_JS,
  SET_CSS,
  SET_OUTPUT,
  SET_BIN,
  GET_BIN,
  RESET,
  SET_ID,
} from '../actions/bin';

const defaultState = {
  loading: true,
  id: null,
  revision: 1, // may drop this
  output: '',
  html: '',
  javascript: '',
  css: '',
  error: null,
};

export default function reducer(state = defaultState, action) {
  const { type, code, payload } = action;

  if (type === RESET) {
    return defaultState;
  }

  if (type === ERROR) {
    return { ...state, error: action.value };
  }

  if (type === SET_ID) {
    return { ...state, id: action.value };
  }

  if (type === GET_BIN) {
    return handle(state, action, {
      start: prevState => ({
        ...prevState,
        ...defaultState,
        loading: true,
      }),
      failure: prevState => ({
        ...prevState,
        error: payload,
        loading: false,
      }),
      success: prevState => {
        const { html, css, javascript, id } = payload;
        // FIXME handle extra settings
        return { ...prevState, html, css, id, javascript, loading: false };
      },
      // on finish dispatch reset
      // finish: prevState => ({ ...prevState, isLoading: false }),
    });
  }

  if (type === SET_BIN) {
    return {
      ...state,
      html: action.html,
      css: action.css,
      javascript: action.javascript,
      id: action.url || action.id,
      loading: action.loading === undefined ? false : action.loading,
      error: action.error || null,
    };
  }

  if (type === SET_OUTPUT) {
    return { ...state, output: code };
  }

  if (type === SET_HTML) {
    return { ...state, html: code };
  }

  if (type === SET_CSS) {
    return { ...state, css: code };
  }

  if (type === SET_JS) {
    return { ...state, javascript: code };
  }

  return state;
}
