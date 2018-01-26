import { MASS_UPDATE } from '../actions/app';

export const defaultState = {
  javascript: { cl: 'console.log($0);' },
  css: {},
  html: {},
};

export default (state = defaultState, action) => {
  if (action.type === MASS_UPDATE) {
    return { ...state, ...action.value.snippets };
  }

  return state;
};
