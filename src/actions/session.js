export const CHANGE_RESULT = '@@session/CHANGE_RESULT';
export const TRIGGER_PALETTE = '@@session/TRIGGER_PALETTE';
export const DISMISS = '@@session/DISMISS';
export const SET_CURSOR = '@@session/SET_CURSOR';
export const SET_ERROR = '@@session/SET_ERROR';
export const CLEAR_ERROR = '@@session/CLEAR_ERROR';
export const TOGGLE_RESULT = '@@session/TOGGLE_RESULT';
export const DIRTY = '@@session/DIRTY';
export const SET_SPLITTER_WIDTH = '@@session/SET_SPLITTER_WIDTH';
export const HIGHLIGHT_LINES = '@@session/HIGHLIGHT_LINES';

// constants - not event types
export const RESULT_NONE = 'none';
export const RESULT_CONSOLE = 'console';
export const RESULT_PAGE = 'page';
export const RESULT_BOTH = 'both';

export function setSplitterWidth(value) {
  return dispatch => {
    dispatch({ type: SET_SPLITTER_WIDTH, value });
    dispatch(setDirtyFlag(true));
  };
}

export function setHighlightedLines(value = null) {
  return { type: HIGHLIGHT_LINES, value };
}

export function toggleResult() {
  return dispatch => {
    dispatch({ type: TOGGLE_RESULT });
    dispatch(setDirtyFlag(true));
  };
}

export function setDirtyFlag(value = true) {
  return { type: DIRTY, value };
}

// note: value should be in RESULT_*
export function changeResult(value) {
  return { type: CHANGE_RESULT, value };
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
