import { SET_PANEL } from '../actions/share';
import { MASS_UPDATE } from '../actions/app';

import * as MODES from '../lib/cm-modes';

const defaultState = {
  panel: MODES.HTML,
};

export default function(state = defaultState, action) {
  const { type } = action;

  if (type === SET_PANEL) {
    return { ...state, panel: action.value };
  }

  if (type === MASS_UPDATE) {
    return { ...state, ...action.value.share };
  }

  return state;
}
