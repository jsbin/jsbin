import { AUTO_RUN } from '../actions/javascript';
import { MASS_UPDATE } from '../actions/app';

const defaultState = {
  autoRun: true,
};

export default function(state = defaultState, action) {
  const { type } = action;

  if (type === MASS_UPDATE) {
    return { ...state, ...action.value.javascript };
  }

  if (type === AUTO_RUN) {
    return { ...state, authRun: action.value };
  }

  return state;
}
