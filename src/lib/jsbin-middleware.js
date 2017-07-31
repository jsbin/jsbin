import { replace, LOCATION_CHANGE } from 'react-router-redux';
import { SAVE, SET_OUTPUT } from '../actions/bin';
import {
  SET_SPLITTER_WIDTH,
  DISMISS,
  triggerPalette,
  HIGHLIGHT_LINES,
} from '../actions/session';
import { SET_SOURCE, MASS_UPDATE } from '../actions/app';
import { save } from '../lib/bin';
import getSettings from '../lib/settings';

function storeKV(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // noop
  }
}

export function saveSettings(store) {
  const select = state => state.user.settings;

  // returns `unsubscribe`
  let current;
  store.subscribe(() => {
    let previous = current;

    current = select(store.getState());

    if (previous !== current) {
      storeKV('jsbin.user.settings', current);
    }
  });
}

export default store => {
  // I'm adding the storage listener here to sync the settings
  window.addEventListener(
    'storage',
    event => {
      if (event.key === 'jsbin.user.settings') {
        const { editor, app } = getSettings(JSON.parse(event.newValue));
        // prevents the panel from switching
        delete app.source;
        store.dispatch({ type: MASS_UPDATE, value: { editor, app } });
      }
    },
    false
  );

  // return the middleware
  return next => action => {
    const nextAction = next(action);

    /** keeping this for future use so we can use state to save */
    const state = store.getState(); // new state after action was applied
    if (action.type.startsWith('@@app/')) {
      storeKV('jsbin.app', state.app);
    }

    if (action.type === SET_SPLITTER_WIDTH) {
      storeKV('jsbin.splitter-width', state.session.splitterWidth);
    }

    if (action.type === SAVE || (action.type === SET_OUTPUT && state.bin.id)) {
      save(state, store.dispatch);
    }

    if (action.type === LOCATION_CHANGE && action.payload.state) {
      if (action.payload.state.action) {
        store.dispatch(action.payload.state.action);
      }
    }

    // keep the URL in sync
    if (action.type === SET_SOURCE) {
      store.dispatch(replace('?' + action.value.toLowerCase()));
    }

    if (action.type === HIGHLIGHT_LINES) {
      const hash = action.value ? 'L' + action.value : '';
      store.dispatch(replace({ hash, search: state.app.source }));
    }

    if (action.type === DISMISS) {
      // dismiss anything that can be dismissed
      store.dispatch(triggerPalette(false));
    }

    return nextAction;
  };
};
