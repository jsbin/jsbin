export const CHANGE_OUTPUT = '@@session/CHANGE_OUTPUT';
export const TRIGGER_PALETTE = '@@session/TRIGGER_PALETTE';
export const DISMISS = '@@session/DISMISS';
export const SET_CURSOR = '@@session/SET_CURSOR';
export const SET_ERROR = '@@session/SET_ERROR';
export const CLEAR_ERROR = '@@session/CLEAR_ERROR';
export const TOGGLE_OUTPUT = '@@session/TOGGLE_OUTPUT';
export const SET_SOURCE = '@@session/SET_SOURCE';
export const DIRTY = '@@session/DIRTY';
export const SET_SPLITTER_WIDTH = '@@app/SET_SPLITTER_WIDTH';

// constants - not event types
export const OUTPUT_NONE = 'OUTPUT_NONE';
export const OUTPUT_CONSOLE = 'OUTPUT_CONSOLE';
export const OUTPUT_PAGE = 'OUTPUT_PAGE';
export const OUTPUT_BOTH = 'OUTPUT_BOTH';

export function setSplitterWidth(value) {
  return { type: SET_SPLITTER_WIDTH, value };
}

export function toggleOutput() {
  return { type: TOGGLE_OUTPUT };
}

export function setDirtyFlag(value = true) {
  return { type: DIRTY, value };
}

export function setSource(source) {
  return { type: SET_SOURCE, source };
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
