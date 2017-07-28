import { SAVE_SETTINGS } from '../actions/user';
import { SET_OPTION } from '../actions/editor';
import { CHANGE_OUTPUT } from '../actions/session';
import { TOGGLE_LAYOUT } from '../actions/app';
import { insertChangeIntoUserSettings } from '../lib/settings';

const defaultState = {
  authenticated: false,
  username: 'anonymous',
  token: null,
  settings: '{\n  // you can also use comments\n//  "app.theme": "dark"\n\n}', // this contains JSON
};

const editorSaveOptions = ['lineNumbers', 'LineWrapping'];

const getSettingsChange = (key, action, settings) => {
  return insertChangeIntoUserSettings({ [key]: action.value }, settings);
};

export default function(state = defaultState, action) {
  const { type } = action;

  if (type === CHANGE_OUTPUT) {
    return {
      ...state,
      settings: getSettingsChange('app.output', action, state.settings),
    };
  }

  if (type === TOGGLE_LAYOUT) {
    return {
      ...state,
      settings: getSettingsChange('app.splitVertical', action, state.settings),
    };
  }

  if (type === SET_OPTION && editorSaveOptions.includes(action.option)) {
    return {
      ...state,
      settings: getSettingsChange(action.option, action, state.settings),
    };
  }

  if (type === SAVE_SETTINGS) {
    return { ...state, settings: action.value };
  }

  return state;
}
