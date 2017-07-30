// picks from https://github.com/codemirror/CodeMirror/blob/910e3becbd8de199165e65e7bd1ade10937f9e0e/src/util/browser.js
const platform = navigator.platform;
const userAgent = navigator.userAgent;

const edge = /Edge\/(\d+)/.exec(userAgent);

export const ios =
  !edge && /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
export const android = /Android/.test(userAgent);
export const mobile = ios || android || false;

export const isMac = ios || /Mac/.test(platform);
export const cmd = isMac ? 'command' : 'ctrl';
export const cmCmd = isMac ? 'Cmd' : 'Ctrl';
