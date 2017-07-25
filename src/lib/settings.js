import { parse, settings as defaultSettings } from './Defaults';

export default function main() {
  const user = getUserSettings(getRawUserSettings());
  const defaults = parse(defaultSettings);

  if (!user) {
    return defaults;
  }

  return merge(defaults, user);
}

export function getRawUserSettings() {
  return JSON.parse(localStorage.getItem('jsbin.user.settings') || 'false');
}

export function getUserSettings(settings) {
  return settings ? parse(settings) : undefined;
}

export function merge(defaults, user) {
  return Object.keys(defaults).reduce((acc, curr) => {
    const rest = user[curr] || {};
    acc[curr] = { ...defaults[curr], ...rest };
    return acc;
  }, {});
}
