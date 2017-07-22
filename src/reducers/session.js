import {
  CHANGE_OUTPUT,
  OUTPUT_PAGE,
  TRIGGER_PALETTE,
} from '../actions/session';

import * as MODES from '../lib/cm-modes';

const defaultState = {
  openPanel: MODES.HTML,
  output: OUTPUT_PAGE,
  palette: false,
};

// last cursor positions
Object.keys(MODES).forEach(key => (defaultState[`cursor${key}`] = 0));

export default function reducer(state = defaultState, action) {
  if (action.type === CHANGE_OUTPUT) {
    return { ...state, output: action.value };
  }

  if (action.type === TRIGGER_PALETTE) {
    return { ...state, palette: action.value };
  }

  return state;
}
