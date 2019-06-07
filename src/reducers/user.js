import decode from 'jwt-decode';

import { SAVE_SETTINGS, SET_TOKEN } from '../actions/user';
import { SET_OPTION } from '../actions/editor';
import { TOGGLE_LAYOUT, SET_THEME, SHOW_WELCOME } from '../actions/app';
import { insertChangeIntoUserSettings } from '../lib/settings';
import { defaultUserSettings } from '../lib/Defaults';

export const defaultState = {
  settings: defaultUserSettings, // NOTE this is a JSON *string*
};

const saveTriggerOptions = ['lineNumbers', 'lineWrapping'];

const getSettingsChange = (key, action, settings) => {
  return insertChangeIntoUserSettings({ [key]: action.value }, settings);
};

export default function(state = defaultState, action) {
  const { type } = action;
  let settingsProp = false;

  switch (type) {
    case SET_THEME:
      settingsProp = 'app.theme';
      break;
    // case CHANGE_RESULT:
    //   settingsProp = 'app.result';
    //   break;
    case TOGGLE_LAYOUT:
      settingsProp = 'app.splitColumns';
      break;
    case SHOW_WELCOME:
      settingsProp = 'app.showWelcome';
      break;
    default:
  }

  if (settingsProp) {
    return {
      ...state,
      settings: getSettingsChange(settingsProp, action, state.settings),
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

  if (type === SET_TOKEN) {
    if (!action.value) {
      // anything falsy will sign out
      return defaultState;
    }

    const user = decode(action.value);
    const {
      username,
      pro,
      githubToken,
      // settings
    } = user;

    return {
      ...state,
      token: action.value,
      ...{
        username,
        pro,
        githubToken,
        // settings
      },
    };
  }

  if (type === SAVE_SETTINGS) {
    return { ...state, settings: action.value };
  }

  return state;
}
