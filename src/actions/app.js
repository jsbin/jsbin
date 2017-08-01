import { setDirtyFlag } from './session';

export const SET_THEME = '@@app/SET_THEME';
export const TOGGLE_LAYOUT = '@@app/TOGGLE_LAYOUT';
export const MASS_UPDATE = '@@app/MASS_UPDATE';
export const SET_SOURCE = '@@app/SET_SOURCE';
export const SHOW_WELCOME = '@@app/SHOW_WELCOME';

export const LIGHT = 'light';
export const DARK = 'dark';

export function setSource(value) {
  return { type: SET_SOURCE, value };
}

export function massUpdate(value) {
  return { type: MASS_UPDATE, value };
}

export function updateShowWelcome(value) {
  return { type: SHOW_WELCOME, value };
}

export function toggleTheme() {
  return (dispatch, getState) => {
    const { app } = getState();

    dispatch(setTheme(app.theme === LIGHT ? DARK : LIGHT));
  };
}

export function setTheme(value) {
  return { type: SET_THEME, value };
}

export function toggleLayout(splitColumns = false) {
  return dispatch => {
    dispatch({ type: TOGGLE_LAYOUT, value: splitColumns });
    dispatch(setDirtyFlag(true));
  };
}
