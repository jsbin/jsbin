import {
  SET_THEME,
  SET_OPTION,
  SET_SOURCE,
  TOGGLE_OUTPUT,
} from '../actions/editor';

import * as MODE from '../lib/cm-modes';

const defaultState = {
  theme: 'jsbin',
  lineWrapping: true,
  lineNumbers: true,
  vertical: true,
  source: MODE.HTML,
  output: true,
};

export default function reducer(state = defaultState, action) {
  const { type } = action;

  if (type === SET_SOURCE) {
    return { ...state, source: action.source };
  }

  if (type === TOGGLE_OUTPUT) {
    return { ...state, output: action.value };
  }

  if (type === SET_OPTION) {
    return { ...state, [action.option]: action.value };
  }

  if (type === SET_THEME) {
    return { ...state, theme: action.theme };
  }

  return state;
}
