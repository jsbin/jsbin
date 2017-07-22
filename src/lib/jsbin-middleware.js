import { replace, LOCATION_CHANGE } from 'react-router-redux';
import { SET_SOURCE } from '../actions/editor';
import { RESET } from '../actions/bin';
import { DISMISS, triggerPalette } from '../actions/session';

export default store => next => action => {
  const nextAction = next(action);

  /** keeping this for future use so we can use state to save */
  const state = store.getState(); // new state after action was applied
  if (action.type.startsWith('@@editor/')) {
    try {
      localStorage.setItem('jsbin.editor', JSON.stringify(state.editor));
    } catch (e) {
      // noop
    }
  }

  if (action.type === LOCATION_CHANGE) {
    store.dispatch({ type: RESET });
  }

  // keep the URL in sync
  if (action.type === SET_SOURCE) {
    store.dispatch(replace('?' + action.source.toLowerCase()));
  }

  if (action.type === DISMISS) {
    store.dispatch(triggerPalette(false));
  }

  return nextAction;
};
