export const SET_THEME = 'SET_THEME';
export const SET_OPTION = 'SET_OPTION';
export const SET_SOURCE = 'SET_SOURCE';
export const TOGGLE_OUTPUT = 'TOGGLE_OUTPUT';

export function toggleOutput(show) {
  return { type: TOGGLE_OUTPUT, value: show };
}

export function setTheme(theme) {
  return { type: SET_THEME, theme };
}

export function setSource(source) {
  return { type: SET_SOURCE, source };
}

export function set(option, value) {
  return { type: SET_OPTION, option, value };
}
