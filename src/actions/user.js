export const SAVE_SETTINGS = '@@user/local/SAVE_SETTINGS';

export function saveSettings(value) {
  return { type: SAVE_SETTINGS, value };
}
