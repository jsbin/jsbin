export const SAVE_SETTINGS = '@@user/local/SAVE_SETTINGS';
export const SET_TOKEN = '@@user/set/TOKEN';

export function setToken(value) {
  return { type: SET_TOKEN, value };
}

export function saveSettings(value) {
  if (value === undefined) {
    throw new Error('saveSettings requires user settings object');
  }
  return { type: SAVE_SETTINGS, value };
}
