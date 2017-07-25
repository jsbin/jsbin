import {
  MASS_UPDATE,
  SET_THEME,
  TOGGLE_THEME,
  TOGGLE_LAYOUT,
} from '../actions/app';

const lightTheme = 'light';
const darkTheme = 'dark';

export const defaultState = {
  theme: lightTheme,
  vertical: false,
  splitterWidth: 50,
};

export default function reducer(state = defaultState, action) {
  const { type } = action;

  if (type === MASS_UPDATE) {
    return { ...state, ...action.value.app };
  }

  if (type === TOGGLE_LAYOUT) {
    const vertical =
      action.value === undefined ? !state.vertical : action.value;
    return { ...state, vertical };
  }

  if (type === TOGGLE_THEME) {
    return {
      ...state,
      theme: state.theme === lightTheme ? darkTheme : lightTheme,
    };
  }

  if (type === SET_THEME) {
    return { ...state, theme: action.theme };
  }

  return state;
}
