import {
  MASS_UPDATE,
  SET_THEME,
  TOGGLE_LAYOUT,
  SET_SOURCE,
  LIGHT,
} from '../actions/app';

import * as MODES from '../lib/cm-modes';

export const defaultState = {
  theme: LIGHT,
  splitColumns: false,
  splitterWidth: 50,
  source: MODES.HTML,
};

export default function reducer(state = defaultState, action) {
  const { type } = action;

  if (type === SET_SOURCE) {
    return { ...state, source: action.value };
  }

  if (type === MASS_UPDATE) {
    return { ...state, ...action.value.app };
  }

  if (type === TOGGLE_LAYOUT) {
    const splitColumns =
      action.value === undefined ? !state.splitColumns : action.value;
    return { ...state, splitColumns };
  }

  if (type === SET_THEME) {
    return { ...state, theme: action.value };
  }

  return state;
}
