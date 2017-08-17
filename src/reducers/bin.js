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
  FETCH_BIN_FAILURE,
  FETCH_BIN_SUCCESS,
  FETCH_BIN_REQUEST,
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
  const { type, code, value } = action;

  if (type === SET_PROCESSOR) {
    if (!hasProcessor(value)) {
      throw new Error(`unknown processor "${value}"`);
    }

    return { ...state, [action.source + '-processor']: value };
  }

  if (type === FETCH_BIN_REQUEST) {
    return { ...defaultState, loading: true };
  }

  if (type === FETCH_BIN_FAILURE) {
    return { ...state, loading: false, error: value };
  }

  if (type === RESET) {
    return defaultState;
  }

  if (type === ERROR) {
    return { ...state, error: value };
  }

  if (type === SET_ID) {
    return { ...state, id: value };
  }

  if (type === FETCH_BIN_SUCCESS) {
    return { ...state, error: null, loading: false };
  }

  if (type === SET_BIN) {
    const loading = action.payload.loading;
    return {
      ...defaultState, // SET_BIN is also a total reset
      ...action.payload,
      loading: loading === undefined ? false : loading,
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
    return { ...state, [key]: code, updated: new Date() };
  }

  return state;
}
