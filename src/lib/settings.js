import { parse, settings as defaultSettings } from './Defaults';
import stripJsonComments from 'strip-json-comments';

/**
 * @returns {Object} Merged user settings (from localStorage) and default settings
 * as defined in ./lib/Default.js
 */
export default function main() {
  const user = getUserSettings(getRawUserSettings());
  const defaults = parse(defaultSettings);

  if (!user) {
    return defaults;
  }

  return merge(defaults, user);
}

/**
 * Gets user's settings from localStorage
 *
 * @returns {String|Null} The user settings are JSON with comments string, this
 * should then be passed into getUserSettings
 * @see {@link getUserSettings} for next stage in parsing
 */
export function getRawUserSettings() {
  return JSON.parse(localStorage.getItem('jsbin.user.settings') || 'null');
}

/**
 * Turns the user's JSON settings into a nested JavaScript object
 *
 * @param {String} settings The JSON (optionally with comments) to be parsed
 * @returns {Object} One level deep object with user settings
 */
export function getUserSettings(settings) {
  return settings ? parse(settings) : undefined;
}

/**
 * Run a single level deep merge of user settings. The argument order is akin
 * to Object.assign, in that the last argument has priority in the final result.
 *
 * @param {Object} defaults Initial settings to extend
 * @param {Object} user Settings to customise and prioritise into settings,
 * this will overwrite deep properties in the defaults.
 * @returns {Object} Final complete setting object, compatible with JS Bin redux state
 */
export function merge(defaults, user) {
  return Object.keys(defaults).reduce((acc, curr) => {
    const rest = user[curr] || {};
    acc[curr] = { ...defaults[curr], ...rest };
    return acc;
  }, {});
}

/**
 * Modifies the user's setting (string) with a change
 *
 * @param {object} change { key: value } change to settings
 * @param {string} settings The JSON object for the user settings
 * @param {[Any]} previousValue If replacing an existing value, it's useful to
 * include the previous value for replacement
 */
export function insertChangeIntoUserSettings(change, settings, previousValue) {
  const [key, value] = Object.entries(change)[0];

  if (previousValue !== undefined) {
    previousValue = JSON.stringify(previousValue);
  }

  const search = `"${key}"`;
  const insert = `${search}: ${JSON.stringify(value)}\n`;
  const json = stripJsonComments(settings, { whitespace: true });
  const isEmpty = Object.keys(JSON.parse(json)).length === 0;
  let splitStart = -1;
  let splitEnd = -1;
  let replace = false;

  if (!settings.includes(search)) {
    // then we need to insert
    splitStart = json.lastIndexOf('}');
    splitEnd = splitStart;
  } else {
    replace = true;
    splitStart = json.lastIndexOf(search);
    let end = json.indexOf(previousValue, splitStart) + previousValue.length;
    splitEnd = end;
  }

  const [left, right] = [
    settings.substr(0, splitStart),
    settings.substr(splitEnd),
  ];
  let res = left;
  if (!isEmpty && !replace) {
    res += ', ';
  }
  res += insert + right;

  return res;
}
