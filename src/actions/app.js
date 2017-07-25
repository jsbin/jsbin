export const SET_THEME = '@@app/SET_THEME';
export const SET_SPLITTER_WIDTH = '@@app/SET_SPLITTER_WIDTH';
export const TOGGLE_THEME = '@@app/TOGGLE_THEME';

export function toggleTheme() {
  return { type: TOGGLE_THEME };
}

export function setSplitterWidth(value) {
  return { type: SET_SPLITTER_WIDTH, value };
}

export function setTheme(theme) {
  return { type: SET_THEME, theme };
}
