import { SAVE_SETTINGS } from '../actions/user';
import { SET_OPTION } from '../actions/editor';
import { CHANGE_OUTPUT } from '../actions/session';
import { TOGGLE_LAYOUT, SET_THEME, SHOW_WELCOME } from '../actions/app';
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
  let settingsProp = '';

  switch (type) {
  case SET_THEME:
    settingsProp = 'app.theme';
    // falls through
  case CHANGE_OUTPUT:
    settingsProp = 'app.output';
    // falls through
  case TOGGLE_LAYOUT:
    settingsProp = 'app.splitColumns';
    // falls through
  case SHOW_WELCOME:
    if (!settingsProp) settingsProp = 'app.showWelcome';
    return {
      ...state,
      settings: getSettingsChange(settingsProp, action, state.settings),
    };
  default:
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
