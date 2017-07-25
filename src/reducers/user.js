import { SAVE_SETTINGS } from '../actions/user';

const defaultState = {
  authenticated: false,
  username: 'anonymous',
  token: null,
  settings: '{\n  // your JSON settings can also include comments\n  \n}', // this contains JSON
};

export default function(state = defaultState, action) {
  const { type } = action;

  if (type === SAVE_SETTINGS) {
    return { ...state, settings: action.value };
  }

  return state;
}
