import { replace, LOCATION_CHANGE } from 'react-router-redux';
import { SET_SPLITTER_WIDTH } from '../actions/app';
import { SAVE } from '../actions/bin';
import { SAVE_SETTINGS } from '../actions/user';
import {
  DISMISS,
  triggerPalette,
  setDirtyFlag,
  SET_SOURCE,
} from '../actions/session';
import { save } from '../lib/bin';

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

  if (action.type === SAVE_SETTINGS) {
    try {
      localStorage.setItem(
        'jsbin.user.settings',
        JSON.stringify(state.user.settings)
      );
    } catch (e) {
      // noop
    }
  }

  if (action.type === SET_SPLITTER_WIDTH) {
    store.dispatch(setDirtyFlag());
  }

  if (action.type === SAVE) {
    save(state, store.dispatch);
  }

  if (action.type === LOCATION_CHANGE && action.payload.state) {
    if (action.payload.state.action) {
      store.dispatch(action.payload.state.action);
    }
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
