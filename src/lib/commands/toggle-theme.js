import { toggleTheme } from '../../actions/app';

export const toggleThemeCmd = {
  title: 'Toggle dark/light theme',
  run: dispatch => {
    dispatch(toggleTheme());
  },
};
