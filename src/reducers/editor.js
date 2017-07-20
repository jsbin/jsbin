import { SET_THEME } from '../actions/editor';

const defaultState = {
  theme: 'jsbin'
};

export default function reducer(state = defaultState, action) {
  const { type } = action;

  if (type === SET_THEME) {
    return { ...state, theme: action.theme };
  }

  return state;
}
