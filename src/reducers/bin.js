import { handle } from 'redux-pack';

import {
  SET_HTML,
  SET_JS,
  SET_CSS,
  SET_OUTPUT,
  SET_BIN,
  GET_BIN
} from '../actions/bin';

const defaultState = {
  loading: true,
  output: '',
  html: '',
  javascript: '',
  css: ''
};

export default function reducer(state = defaultState, action) {
  const { type, code, payload } = action;

  if (type === GET_BIN) {
    return handle(state, action, {
      start: prevState => ({
        ...prevState,
        ...defaultState
      }),
      // finish: prevState => ({ ...prevState, isLoading: false }),
      failure: prevState => ({ ...prevState, error: payload }),
      success: prevState => {
        const { html, css, javascript } = payload;
        // FIXME handle extra settings
        return { ...prevState, html, css, javascript, loading: false };
      }
    });
  }

  if (type === SET_BIN) {
    return {
      ...state,
      html: action.html,
      css: action.css,
      javascript: action.javascript,
      loading: false
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
