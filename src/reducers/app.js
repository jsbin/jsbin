import { SET_THEME, TOGGLE_THEME, SET_SPLITTER_WIDTH } from '../actions/app';

const lightTheme = 'jsbin';
const darkTheme = 'monokai';

export const defaultState = {
  theme: lightTheme,
  vertical: false,
  splitterWidth: 50,
};

export default function reducer(state = defaultState, action) {
  const { type } = action;

  if (type === SET_SPLITTER_WIDTH) {
    return { ...state, splitterWidth: action.value };
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
