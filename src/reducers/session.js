import {
  CHANGE_RESULT,
  RESULT_NONE,
  SET_SPLITTER_WIDTH,
  HIGHLIGHT_LINES,
  TOGGLE_RESULT,
  RESULT_PAGE,
  TRIGGER_PALETTE,
  SET_CURSOR,
  SET_ERROR,
  SWATCH_OPEN,
  CLEAR_ERROR,
  DIRTY,
} from '../actions/session';

import { RESET } from '../actions/bin';

import * as MODES from '../lib/cm-modes';

const defaultCursorState = {
  [`cursor${MODES.HTML}`]: '8:0', // start on the blank line
  [`cursor${MODES.JAVASCRIPT}`]: '1:0', // start on the blank line
  [`cursor${MODES.CSS}`]: '0:0', // start on the blank line
};

export const defaultState = {
  swatchOpen: false,
  result: RESULT_PAGE,
  lastResult: RESULT_NONE,
  highlightedLines: null,
  palette: false,
  error: null,
  splitterWidth: 50,
  dirty: false,
  ...defaultCursorState,
};

export default function reducer(state = defaultState, action) {
  const { type } = action;
  if (type === RESET) {
    return { ...state, ...defaultCursorState, error: null };
  }

  if (type === SWATCH_OPEN) {
    return { ...state, swatchOpen: action.value };
  }

  if (type === HIGHLIGHT_LINES) {
    return { ...state, highlightedLines: action.value };
  }

  if (type === DIRTY) {
    return { ...state, dirty: action.value };
  }

  if (type === SET_SPLITTER_WIDTH) {
    return { ...state, splitterWidth: action.value };
  }

  if (type === TOGGLE_RESULT) {
    const result =
      state.result === RESULT_NONE ? state.lastResult : RESULT_NONE;
    return { ...state, lastResult: state.result, result };
  }

  if (type === SET_ERROR) {
    return { ...state, error: action.value };
  }

  if (type === CLEAR_ERROR) {
    return { ...state, error: null };
  }

  if (type === CHANGE_RESULT) {
    return { ...state, result: action.value };
  }

  if (type === SET_CURSOR) {
    if (!state[`cursor${action.panel}`]) {
      // ignore unknown panels
      return state;
    }
    return { ...state, [`cursor${action.panel}`]: action.value };
  }

  if (type === TRIGGER_PALETTE) {
    return { ...state, palette: action.value };
  }

  return state;
}
