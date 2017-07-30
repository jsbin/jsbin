import { SAVE_SETTINGS } from '../actions/user';
import { SET_OPTION } from '../actions/editor';
import { CHANGE_OUTPUT } from '../actions/session';
import { TOGGLE_LAYOUT, SET_THEME } from '../actions/app';
import { insertChangeIntoUserSettings } from '../lib/settings';
import { defaultUserSettings } from '../lib/Defaults';

const defaultState = {
  authenticated: false,
  username: 'anonymous',
  token: null,
  settings: defaultUserSettings, // NOTE this is a JSON *string*
};

const saveTriggerOptions = ['lineNumbers', 'lineWrapping'];

const getSettingsChange = (key, action, settings) => {
  return insertChangeIntoUserSettings({ [key]: action.value }, settings);
};

export default function(state = defaultState, action) {
  const { type } = action;

  if (type === SET_THEME) {
    return {
      ...state,
      settings: getSettingsChange('app.theme', action, state.settings),
    };
  }

  if (type === CHANGE_OUTPUT) {
    return {
      ...state,
      settings: getSettingsChange('app.output', action, state.settings),
    };
  }

  if (type === TOGGLE_LAYOUT) {
    return {
      ...state,
      settings: getSettingsChange('app.splitColumns', action, state.settings),
    };
  }

  if (type === SET_OPTION && saveTriggerOptions.includes(action.option)) {
    return {
      ...state,
      settings: getSettingsChange(
        `editor.${action.option}`,
        action,
        state.settings
      ),
    };
  }

  if (type === SAVE_SETTINGS) {
    return { ...state, settings: action.value };
  }

  return state;
}
