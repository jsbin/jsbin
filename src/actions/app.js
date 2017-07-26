export const SET_THEME = '@@app/SET_THEME';
export const TOGGLE_THEME = '@@app/TOGGLE_THEME';
export const TOGGLE_LAYOUT = '@@app/TOGGLE_LAYOUT';
export const MASS_UPDATE = '@@app/MASS_UPDATE';
export const SET_SOURCE = '@@app/SET_SOURCE';

export function setSource(value) {
  return { type: SET_SOURCE, value };
}

export function massUpdate(value) {
  return { type: MASS_UPDATE, value };
}

export function toggleTheme() {
  return { type: TOGGLE_THEME };
}

export function setTheme(theme) {
  return { type: SET_THEME, theme };
}

export function toggleLayout(vertical = false) {
  return { type: TOGGLE_LAYOUT, value: vertical };
}
