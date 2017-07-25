export const SET_THEME = '@@app/SET_THEME';
export const TOGGLE_THEME = '@@app/TOGGLE_THEME';
export const TOGGLE_LAYOUT = '@@app/TOGGLE_LAYOUT';
export const MASS_UPDATE = '@@editor/MASS_UPDATE';

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
