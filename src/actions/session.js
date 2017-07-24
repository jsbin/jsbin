export const CHANGE_OUTPUT = '@@session/CHANGE_OUTPUT';
export const TRIGGER_PALETTE = '@@session/TRIGGER_PALETTE';
export const DISMISS = '@@session/DISMISS';
export const SET_CURSOR = '@@session/SET_CURSOR';
export const SET_ERROR = '@@session/SET_ERROR';
export const CLEAR_ERROR = '@@session/CLEAR_ERROR';
export const TOGGLE_OUTPUT = '@@session/TOGGLE_OUTPUT';

// constants - not event types
export const OUTPUT_NONE = 'OUTPUT_NONE';
export const OUTPUT_CONSOLE = 'OUTPUT_CONSOLE';
export const OUTPUT_PAGE = 'OUTPUT_PAGE';
export const OUTPUT_BOTH = 'OUTPUT_BOTH';

export function toggleOutput() {
  return { type: TOGGLE_OUTPUT };
}

// note: value should be in OUTPUT_*
export function changeOutput(value) {
  return { type: CHANGE_OUTPUT, value };
}

export function triggerPalette(show) {
  return { type: TRIGGER_PALETTE, value: show };
}

export function setError(value) {
  return { type: SET_ERROR, value };
}

export function clearError() {
  return { type: CLEAR_ERROR };
}

export function dismiss() {
  return { type: DISMISS };
}

export function setCursor(panel, line, ch) {
  return { type: SET_CURSOR, panel, value: `${line}:${ch}` };
}
