export const SAVE_SETTINGS = '@@user/local/SAVE_SETTINGS';

export function saveSettings(value) {
  if (value === undefined) {
    throw new Error('saveSettings requires user settings object');
  }
  return { type: SAVE_SETTINGS, value };
}
