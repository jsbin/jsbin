import { handle } from 'redux-pack';
import * as defaults from '../lib/Defaults';
import * as MODES from '../lib/cm-modes';

import { has as hasProcessor } from '../lib/processor';

import {
  SET_HTML,
  ERROR,
  SET_JS,
  SET_CSS,
  SET_RESULT,
  SET_BIN,
  GET_BIN,
  RESET,
  SET_ID,
  SET_PROCESSOR,
} from '../actions/bin';

export const defaultState = {
  loading: false,
  id: null,
  revision: 1, // may drop this
  result: '',
  html: defaults.html,
  javascript: defaults.javascript,
  css: defaults.css,
  updated: null,
  error: null,
};

// creates defaultState.html-processor = 'html' etc
Object.keys(MODES).forEach(mode => {
  defaultState[`${MODES[mode]}-processor`] = MODES[mode];
});

export default function reducer(state = defaultState, action) {
  const { type, code, payload } = action;

  if (type === SET_PROCESSOR) {
    const value = action.value;
    if (!hasProcessor(value)) {
      throw new Error(`unknown processor "${value}"`);
    }

    return { ...state, [action.source + '-processor']: value };
  }

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
        error:
          payload instanceof Error
            ? { message: payload.message, status: payload.status || 500 }
            : payload,
        loading: false,
      }),
      success: prevState => {
        // FIXME handle extra settings
        return { ...prevState, ...payload, loading: false };
      },
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

  if (type === SET_RESULT) {
    return { ...state, result: code };
  }

  let key = null;
  if (type === SET_HTML) {
    key = MODES.HTML;
  }

  if (type === SET_CSS) {
    key = MODES.CSS;
  }

  if (type === SET_JS) {
    key = MODES.JAVASCRIPT;
  }

  if (key !== null) {
    return { ...state, html: code, updated: new Date() };
  }

  return state;
}
