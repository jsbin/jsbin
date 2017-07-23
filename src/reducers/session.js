import {
  CHANGE_OUTPUT,
  OUTPUT_PAGE,
  TRIGGER_PALETTE,
  SET_CURSOR,
  SET_ERROR,
  CLEAR_ERROR,
} from '../actions/session';

import { RESET } from '../actions/bin';

import * as MODES from '../lib/cm-modes';

const defaultCursorState = Object.keys(MODES).reduce((acc, curr) => {
  acc[`cursor${MODES[curr]}`] = '0:0';
  return acc;
}, {});

const defaultState = {
  openPanel: MODES.HTML,
  output: OUTPUT_PAGE,
  palette: false,
  error: null,
  ...defaultCursorState,
};

export default function reducer(state = defaultState, action) {
  if (action.type === RESET) {
    return { ...state, ...defaultCursorState, error: null };
  }

  if (action.type === SET_ERROR) {
    return { ...state, error: action.value };
  }

  if (action.type === CLEAR_ERROR) {
    return { ...state, error: null };
  }

  if (action.type === CHANGE_OUTPUT) {
    return { ...state, output: action.value };
  }

  if (action.type === SET_CURSOR) {
    return { ...state, [`cursor${action.panel}`]: action.value };
  }

  if (action.type === TRIGGER_PALETTE) {
    return { ...state, palette: action.value };
  }

  return state;
}
