import { SET_OPTION, MASS_UPDATE } from '../actions/editor';

export const defaultState = {
  lineWrapping: true,
  lineNumbers: true,
};

export default function reducer(state = defaultState, action) {
  const { type } = action;

  if (type === MASS_UPDATE) {
    return { ...state, ...action.value };
  }

  if (type === SET_OPTION) {
    return { ...state, [action.option]: action.value };
  }

  return state;
}
